import React from "react";

interface Props {
}

interface State {
  data: {
    loaded: Boolean,
    name: String,
    version: String,
    commitId: String,
    buildTime: String
  }
}

/**
 *
 * React component used for displaying details about the application instance.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: {
        loaded: false,
        name: '',
        version: '',
        commitId: '',
        buildTime: ''
      }
    };
  }

  componentDidMount() {
    fetch(`/about.json`)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.setState({
          data: {
            ...data,
            loaded: true
          }
        });
      });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        { data.loaded &&
          ( <div>
              <h1>About</h1>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Application Name</td>
                  </tr>
                  <tr>
                    <td>{ data.name }</td>
                  </tr>
                  <tr>
                    <td>Version</td>
                  </tr>
                  <tr>
                    <td>{ data.version }</td>
                  </tr>
                  <tr>
                    <td>CommitId</td>
                  </tr>
                  <tr>
                    <td>{ data.commitId }</td>
                  </tr>
                  <tr>
                    <td>Build time</td>
                  </tr>
                  <tr>
                    <td>{ data.buildTime }</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    );
  }
}

export default About;