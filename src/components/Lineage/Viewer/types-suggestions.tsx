import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Loader } from '@mantine/core';
import { lineage } from "../../api/lineage";

export function TypesSuggestions(props: any) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    lineage.getLineageTypes().then(response => response.json()).then(data => {
      // @ts-ignore
      setOptions([...data]);
    });
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
      sx={{ width: 300 }}
      open={open}
      onOpen={() => { setOpen(true); }}
      onClose={() => { setOpen(false); }}
      options={options}
      loading={loading}
      renderInput={(params: any) => (
        <TextField
          {...params}
          label={props.searchedItem ? "Searched Type" : "Related Type"}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <Loader size="sm" /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}