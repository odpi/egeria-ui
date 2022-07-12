import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {SyntheticEvent} from "react";
import {getComponent} from "../../../helpers/commons";
import {lineage} from "../../../services/lineage.service";

export default function NameSuggestions(props: any) {

    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    let onInputChange = (event: SyntheticEvent, value: string, reason: string) => {
        if (reason === "input") {
            let name_id: string = event.currentTarget.id
            let type_id: string = "#type-" + name_id;
            const typeBox: any = getComponent(type_id);
            let selectedType: string = typeBox.value;
            if (selectedType != null) {
                lineage.getNameSuggestions(value, selectedType).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data)
                    // @ts-ignore
                    setOptions([...new Set(data)])
                });
            } else {
                console.log("please select a type")
            }
        }
    };

    React.useEffect(() => {
        if (!loading) {
            return undefined;
        }
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);


    return (
        <Autocomplete
            freeSolo
            id={props.itemId}
            sx={{width: 300}}
            open={open}
            onOpen={() => {setOpen(true);}}
            onClose={() => {setOpen(false);}}
            getOptionLabel={(option) => option}
            onInputChange={onInputChange}
            options={options}
            loading={loading}
            filterOptions={(x) => x}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.searchedItem ? "Searched Name" : "Related Name"}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}