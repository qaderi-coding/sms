import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TableRow, TextField } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../store';
import CustomTextField from './CustomTextField';
import CustomFormTable, { WrapInCell } from './CustomFormTable';
import CustomDialog, { CustomDialogActions } from '../CustomDialog';
import AutoCompleteFieldProps, { AutoCompleteOptionsSelector, AutoCompleteReducerAction } from '../props/AutoCompleteFieldProps';
import { transList } from '../../utils/functions/trans';
import { getTranslateWhenNotNullOrUndefined } from '../../utils/functions/inputHelpers';
import { ExtendedDictionary } from '../../utils/types/IDictionary';

function CustomSelectField({
  name,
  value,
  valueLabel,
  multi,
  label,
  readonly,
  translate,
  error,
  onChange,
  onBlur,
  arrayOptions,
  reducerOptions = new AutoCompleteReducerAction(
    () => {},
    () => undefined
  ),
  optionSelector = new AutoCompleteOptionsSelector<any>('', ''),
  sx
}: AutoCompleteFieldProps) {
  // const [trans, i18n] = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(reducerOptions.selector);
  const dialogRef = useRef<CustomDialogActions>(null);
  // const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const [optionsList, setOptionsList] = useState<any[]>(Array.isArray(arrayOptions) ? arrayOptions : []);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');

  const isValueCorrect = () => value !== undefined && value !== null && value !== '';
  const isOptionsArrayEmpty = () => arrayOptions === undefined;
  const shouldCache = () => reducerOptions.cacheable;
  const shouldNotCache = () => !reducerOptions.cacheable;

  function dispatchReducerAction(term?: string) {
    if (isOptionsArrayEmpty()) {
      if (shouldNotCache() || !(data instanceof Array) || optionsList.length === 0) {
        dispatch(
          reducerOptions.action({
            term,
            load_count: reducerOptions.load_count,
            ...reducerOptions.dispatchData
          })
        );
        setLoading(true);
      }
    }
  }

  function setStateFromReducer() {
    if (isOptionsArrayEmpty()) {
      if ((shouldCache() && Array.isArray(data) && optionsList.length !== data.length) || (shouldNotCache() && Array.isArray(data))) {
        setOptionsList(data);
      }
    }
    setLoading(false);
  }

  function generateOptionFromValue() {
    if (arrayOptions?.length === 0) {
      return new ExtendedDictionary().add(optionSelector.value, value).add(optionSelector.label, valueLabel);
    } else {
      return optionsList.find((x) => x[optionSelector.value] === value);
    }
  }

  function setSelectedOptionFromValue() {
    if (isValueCorrect()) {
      const selected = generateOptionFromValue();
      if (selected) setSelectedOption(selected);
    } else {
      setSelectedOption(null);
    }
  }

  function filterOfflineList(term: string) {
    if (!term) return optionsList;
    return optionsList.filter((item) => {
      if (optionSelector.columns.length > 0) {
        return optionSelector.columns.some((column) => String(item[column]).toLowerCase().includes(String(term).toLowerCase()));
      } else {
        return String(item[optionSelector.label]).toLowerCase().includes(String(term).toLowerCase());
      }
    });
  }

  const filteredList = useMemo(() => {
    if (!Array.isArray(optionsList)) return [];
    return reducerOptions.load_count ? optionsList : filterOfflineList(filter);
  }, [filter, optionsList]);

  useEffect(() => {
    if (Array.isArray(arrayOptions) && arrayOptions.length !== 0) {
      setOptionsList(arrayOptions);
    }
  }, [arrayOptions]);

  useEffect(() => {
    try {
      dispatchReducerAction();
    } catch (error) {
      console.error(name);
    }

    console.log(name);
  }, []);

  useEffect(() => {
    setStateFromReducer();
  }, [data]);

  useEffect(() => {
    setSelectedOptionFromValue();
  }, [value, optionsList]);

  const shrink = selectedOption !== null && selectedOption !== undefined;

  if (optionSelector.columns.length === 0) {
    return (
      <>
        <Autocomplete
          id="autocomplete"
          size="small"
          sx={{ ...sx }}
          value={selectedOption}
          options={filteredList}
          onChange={onChange}
          disabled={readonly === true}
          loading={loading}
          autoHighlight
          onOpen={() => dispatchReducerAction()}
          renderOption={(props, option, index) => (
            <li {...props} key={`listItem-${index}-${option[optionSelector.value]}`}>
              {option[optionSelector.label]}
            </li>
          )}
          filterOptions={(options: any[], state) => {
            if (reducerOptions.load_count && state.inputValue !== filter) {
              dispatchReducerAction(state.inputValue);
            }
            setFilter(state.inputValue);
            return filteredList;
          }}
          isOptionEqualToValue={(option, value) => option?.[optionSelector.value] === value?.[optionSelector.value]}
          getOptionLabel={(option) => (option ? option[optionSelector.label] : '')}
          //   renderInput={(params) => <TextField {...params} label={defaultLabel} />}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
        {error && (
          <FormHelperText style={{ color: '#f44336' }} error={!!error}>
            {error}
          </FormHelperText>
        )}
      </>
    );
  } else {
    return (
      <Box>
        <FormControl sx={{ ...sx }} size="small" fullWidth onBlur={onBlur} disabled={readonly}>
          <InputLabel id={`${name}_label`} shrink={shrink}>
            {/* {defaultLabel} */}
            {label}
          </InputLabel>
          <Select
            id={name}
            labelId={`${name}_label`}
            // label={defaultLabel} // Add this line to fix the label issue
            label={label}
            value={selectedOption ? selectedOption[optionSelector.value] : ''}
            disabled={readonly === true}
            onClick={() => dialogRef?.current?.showModal()}
            renderValue={(value: any) => (value ? selectedOption?.[optionSelector.label] : '') as ReactNode}
            onBlur={onBlur}
            notched={shrink}
            error={!!error}
            readOnly
          >
            {selectedOption ? (
              <MenuItem value={selectedOption[optionSelector.value]}>{selectedOption[optionSelector.label]}</MenuItem>
            ) : (
              <MenuItem value="">{'Select an item'}</MenuItem>
            )}
          </Select>
          {error && (
            <FormHelperText style={{ color: '#f44336' }} error={!!error}>
              {error}
            </FormHelperText>
          )}
        </FormControl>
        <CustomDialog
          title={'Select Item'}
          ref={dialogRef}
          onOpen={() => {
            const el = document.querySelector(`#autocomplete_filter`) as HTMLInputElement;
            if (el) {
              el.focus();
              el.select();
            }
          }}
        >
          <CustomTextField
            name={'autocomplete_filter'}
            label={'Filter'}
            value={filter}
            onChange={(event: any) => {
              if (reducerOptions.load_count) {
                dispatchReducerAction(event.target.value);
              }
              setFilter(event.target.value);
            }}
            sx={{ control: { width: '100%', margin: '10px 0' } }}
          />
          {/* <CustomFormTable headers={transList(trans, optionSelector.columns)} key={`${name}_autocomplete`}> */}
          <CustomFormTable headers={optionSelector.columns} key={`${name}_autocomplete`}>
            {Array.isArray(filteredList) &&
              filteredList.map((item: any, index) => (
                <TableRow
                  onClick={(event: any) => {
                    onChange(event, item);
                    dialogRef?.current?.hideModal();
                  }}
                  selected={item[optionSelector.value] === selectedOption?.[optionSelector.value]}
                  hover
                  style={{ cursor: 'pointer' }}
                  key={index}
                >
                  {optionSelector.columns.map((column, index) => (
                    <WrapInCell key={`${index}-${item[column]}`} sx={{ padding: '8px', align: 'left' }}>
                      {item[column]}
                    </WrapInCell>
                  ))}
                </TableRow>
              ))}
          </CustomFormTable>
        </CustomDialog>
      </Box>
    );
  }
}

export default CustomSelectField;
