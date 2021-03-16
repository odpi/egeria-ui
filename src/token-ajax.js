/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

import './spinner.js';

import { ENV } from '../env';

class TokenAjax extends PolymerElement {


    static get properties() {
        return {
            token: {
                type: String,
                notify: true,
                observer: '_tokenUpdated'
            },
            loading: {
                type: Boolean,
                notify: true
            },
            url: String,
            lastResponse: {
                notify: true
            },
            method: {
                type: String,
                value: 'GET'
            },
            body: {
                type: Object
            },
            headers: {
                type: Object,
                value: {'content-type' : 'application/json'},
                notify: true
            },
            timeout: {
                type: Number,
                value: 30000
            },
            /**
             * If true, automatically performs an Ajax request when either `url` or
             * `params` changes.
             */
            auto: {type: Boolean, value: false}

        };
    }

    static get observers() {
        return [
            // Observer method name, followed by a list of dependencies, in parenthesis
            '_requestOptionsChanged(auto)',
            '_loadingChanged(loading)']
    }

    connectedCallback(){
        super.connectedCallback();
        this.$.storage.reload();
    }

    _go(){
        this.$.storage.reload();
        //console.debug('_go with token:'+this.token);
        if( typeof this.token !== 'undefined'){
            this.$.ajax.headers['content-type'] = 'application/json';
            this.$.ajax.headers['x-auth-token'] = this.token;
            this._rootPathUrl();
            this.$.ajax.generateRequest();
        }else{
            console.debug('No token set to token-ajax: no _go');
        }
    }

    /**
     *
     * enforcing url starts with rootPath, except a relative url
     */
    _rootPathUrl(){
        if(this.$.ajax.url.startsWith('/') && !this.$.ajax.url.startsWith(this.rootPath) ){
            this.$.ajax.url = this.rootPath +this.$.ajax.url.substring(1);
        }
    }

    _tokenUpdated(){
        this.$.ajax.headers['x-auth-token'] = this.token;
    }

    _requestOptionsChanged(auto){
        if (this.auto) {
            this._go();
        }
    }

    _handleErrorResponse(evt){
        let status = evt.detail.request.xhr.status;
        let response   = evt.detail.request.xhr.response;
        // Token is not valid, log out.
        if(status > 299){
            if (status === 401 || status === 403 ) {
                this.dispatchEvent(new CustomEvent('logout', {
                    bubbles: true,
                    composed: true,
                    detail: {greeted: "Bye!", status: status}}));
            }else{
                this.dispatchEvent(new CustomEvent('error', {
                    bubbles: true,
                    composed: true,
                    detail: { status: status }}));
                window.dispatchEvent(new CustomEvent('show-feedback', {
                    bubbles: true,
                    composed: true,
                    detail: {message: "We are experiencing an unexpected error. Please try again later!", level: 'error'}}));
            }
        }else if(evt.detail.error.type === "timeout"){
            this.dispatchEvent(new CustomEvent('xhr-error', {
                bubbles: true,
                composed: true,
                detail: { status: status, error: 'timeout' }}));
            window.dispatchEvent(new CustomEvent('show-feedback', {
                bubbles: true,
                composed: true,
                detail: {message: "The request ended due to timeout!", level: 'error', duration: '0'}}));
        }

        this.$.backdrop.close();

    }

    _onLoadingChanged(){}

    _loadingChanged(loading){
        if(this.loading){
            this.$.backdrop.open();
        }else{
            this.$.backdrop.close();
        }
    }

    getApiUrl() {
        return ENV['API_URL'];
    }

    static get template() {
        return html`
        <style>
        :host {
            /*display: none;*/
        }

        </style>
        <iron-localstorage id="storage" name="my-app-storage" value="{{token}}"></iron-localstorage>
        <iron-ajax id="ajax" url="[[ getApiUrl() ]][[ url ]]"
                   handle-as="json"
                   last-response="{{lastResponse}}"
                   timeout="[[timeout]]"
                   on-error="_handleErrorResponse"
                   body="[[body]]"
                   loading="{{loading}}"
                   method="[[method]]"
                   on-loading-changed="_onLoadingChanged"
                   headers="{{headers}}">
        </iron-ajax>

        <spinner-overlay id="backdrop" with-backdrop scroll-action="lock"
            always-on-top
            no-cancel-on-outside-click
            no-cancel-on-esc-key>
        </spinner-overlay>
    `;
    }


}

window.customElements.define('token-ajax', TokenAjax);
