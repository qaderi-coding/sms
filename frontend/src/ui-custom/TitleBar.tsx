import Box from '@mui/material/Box';
import ActionButton from './ActionButton';
import { ButtonGroup, Typography } from '@mui/material';
import {
  Add,
  ArrowBack,
  ArrowForward,
  DataObject,
  Delete,
  Print,
  QueryStats,
  Remove,
  Save,
  Search,
  Storage,
  Sync,
  Translate,
  Undo
} from '@mui/icons-material';
import React, { useEffect } from 'react';
import StickyBar from './StickyBar';
// import { useTranslation } from 'react-i18next';
// import UseConfig from '../hooks/useConfig';
// import { IComponentPermision } from 'apps/authentication/permission/ComponentPermissionTypes';
import useAuth from 'hooks/useAuth';
import { getLocale } from 'i18n';

interface TitleBarProps {
  title: string;
  code?: string;
  readonly?: boolean;
  itemsCount?: number;
  selectedItem?: number;
  printHandler?: any;
  testHandler?: any;
  queryHandler?: any;
  queryStatus?: boolean;
  translationHandler?: any;
  disableTranslations?: boolean;
  searchFormHandler?: any;
  saveFormHandler?: any;
  testStatus?: boolean;
  removeFormHandler?: any;
  disableRemoveBtn?: boolean;
  createPageHandler?: any;
  undoFormHandler?: any;
  addNewRecordHandler?: any;
  nextHandler?: any;
  previousHandler?: any;
  // permission?: IComponentPermision;
  paramId?: number;
  loading?: boolean;
}

const groupStyle = {
  borderRadius: '5px',
  padding: '0.1rem',
  marginRight: '0.1rem',
  marginLeft: '0.1rem',
  '& .MuiButtonBase-root': {
    margin: '0px'
  },
  '& span:first-of-type:not(:last-child) .MuiButtonBase-root': {
    borderRadius: '5px 0 0 5px',
    borderWidth: '1px 0 1px 1px',
    '&:hover': {
      borderWidth: '1px'
    }
  },
  '& span:not(:first-of-type):not(:last-child) .MuiButtonBase-root': {
    borderRadius: '0',
    borderWidth: '1px 0 1px 0',
    '&:hover': {
      borderWidth: '1px'
    }
  },
  '& span:last-child:not(:first-of-type) .MuiButtonBase-root': {
    borderRadius: '0 5px 5px 0',
    borderWidth: '1px 1px 1px 0',
    '&:hover': {
      borderWidth: '1px'
    }
  }
};

function TitleBar(props: TitleBarProps) {
  // const [trans] = useTranslation();
  // const config = UseConfig();
  const auth = useAuth();
  const locale = getLocale();

  useEffect(() => {
    const attachFunctionKeys = (event: any) => {
      if (event.altKey && event.key === '4' && props.printHandler) props.printHandler();
      if (event.altKey && event.key === '5' && props.translationHandler) props.translationHandler();
      if (event.key === 'ArrowRight' && props.nextHandler) props.nextHandler();
      if (event.key === 'ArrowLeft' && props.previousHandler) props.previousHandler();
      if (event.altKey && event.key === '6' && props.undoFormHandler) props.undoFormHandler();
      if (event.altKey && event.key === '7' && props.saveFormHandler) props.saveFormHandler();
      if (((event.altKey && event.key === '8') || event.key === 'F8') && props.searchFormHandler) props.searchFormHandler();
      if (event.altKey && event.key === '9' && props.createPageHandler) props.createPageHandler();
    };
    document.addEventListener('keydown', attachFunctionKeys);
    return () => {
      document.removeEventListener('keydown', attachFunctionKeys);
    };
  }, [props.searchFormHandler]);

  useEffect(() => {
    console.log('loading:', props.loading);
  }, [props.loading]);

  return (
    <StickyBar
      stickTo={'top'}
      id={'title_bar'}
      offset={48}
      sx={{
        originalSx: {
          justifyContent: 'space-between',
          padding: '5px 10px',
          borderRadius: '10px',
          width: '100%',
          margin: '0 0 10px 0'
        },
        scrollingSx: {
          borderRadius: '0',
          width: 'calc(100% + 40px)'
          // margin: config.rtlLayout ? '0 -20px 10px 0' : '0 0 10px -20px'
        }
      }}
    >
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: '500',
          padding: '0.2rem 0.4rem',
          float: 'left'
        }}
      >
        {props.title}
      </Typography>
      <Box>
        <ActionButton
          // title={trans('buttons.test') + ' (Alt+2)'}
          color={props?.testStatus ? 'success' : 'info'}
          onClick={props.testHandler}
          // disabled={auth?.user?.id == 'sig016' ? false : true}
          // disabled={props.readonly == true || props.printHandler == undefined}
        >
          <Sync color={props?.testStatus ? 'success' : 'info'} />
        </ActionButton>
        <ActionButton
          // title={trans('buttons.query') + ' (Alt+2)'}
          color={props?.queryStatus ? 'success' : 'info'}
          onClick={props.queryHandler}
          // disabled={props.readonly == true || props.printHandler == undefined}
        >
          <Storage color={props?.queryStatus ? 'success' : 'info'} />
        </ActionButton>
        <ActionButton
          // title={trans('buttons.print') + ' (Alt+2)'}
          color={'info'}
          onClick={props.printHandler}
          disabled={props.readonly == true || props.printHandler == undefined}
        >
          <Print color={'info'} />
        </ActionButton>
        <ActionButton
          // title={trans('buttons.remove') + ' (Alt+2)'}
          color={'error'}
          onClick={props.removeFormHandler}
          disabled={props.readonly || props.printHandler || props.disableRemoveBtn}
        >
          <Delete color={'error'} />
        </ActionButton>
        <ActionButton
          // title={trans('buttons.translate') + ' (Alt+3)'}
          color={'info'}
          onClick={props.translationHandler}
          disabled={props.disableTranslations}
          // disabled={props.readonly == true || props.translationHandler == undefined}
        >
          <Translate color={'info'} />
        </ActionButton>

        {/* Form Buttons Group Start */}
        {props.itemsCount && props.itemsCount > 0 && props.selectedItem != undefined && (
          <ButtonGroup variant="text" sx={groupStyle}>
            <ActionButton
              // title={trans('buttons.previous') + ' (<)'}
              color={'secondary'}
              onClick={props.previousHandler}
              disabled={
                props.readonly == true ||
                props.previousHandler == undefined ||
                props.itemsCount == undefined ||
                props.itemsCount == 0 ||
                props.selectedItem == undefined ||
                !(props.selectedItem > 0)
              }
            >
              {locale === 'en' ? <ArrowBack color={'secondary'} /> : <ArrowForward color={'secondary'} />}
            </ActionButton>
            <ActionButton
              sx={{
                width: '56px',
                fontSize: '14px'
              }}
              // title={trans('buttons.total') + ` ${props.itemsCount}`}
              color={'secondary'}
              disabled={true}
            >
              {props.selectedItem + 1} / {props.itemsCount}
            </ActionButton>
            <ActionButton
              // title={trans('buttons.next') + ' (>)'}
              color={'secondary'}
              onClick={props.nextHandler}
              disabled={
                props.readonly == true ||
                props.nextHandler == undefined ||
                props.itemsCount == undefined ||
                props.itemsCount == 0 ||
                props.selectedItem == undefined ||
                !(props.selectedItem < props.itemsCount - 1)
              }
            >
              {locale === 'en' ? <ArrowForward color={'secondary'} /> : <ArrowBack color={'secondary'} />}
            </ActionButton>
            <ActionButton
              // title={trans('buttons.create_page') + ' (Alt+9)'}
              color={'info'}
              onClick={props.addNewRecordHandler}
              // disabled={props.readonly == true || props.createPageHandler == undefined}
            >
              <Add color={'info'} />
            </ActionButton>
          </ButtonGroup>
        )}
        {/* Form Buttons Group End */}

        {/* Form Buttons Group Start */}
        <ButtonGroup variant="text" sx={groupStyle}>
          <ActionButton
            // title={trans('buttons.undo') + ' (Alt+6)'}
            color={'info'}
            onClick={props.undoFormHandler}
            disabled={props.readonly == true || props.undoFormHandler == undefined}
          >
            <Undo color={'info'} />
          </ActionButton>
          {props.paramId ? (
            <ActionButton
              // title={trans('buttons.update') + ' (Alt+7)'}
              color={'success'}
              onClick={props.saveFormHandler}
              disabled={
                props.loading == true || props.readonly == true || props.saveFormHandler == undefined
                // props.permission?.update_fl === 'N'
              }
            >
              <Save color={'success'} />
            </ActionButton>
          ) : (
            <ActionButton
              // title={trans('buttons.save') + ' (Alt+7)'}
              color={'success'}
              onClick={props.saveFormHandler}
              disabled={
                props.loading == true || props.readonly || props.saveFormHandler === undefined
                // props.permission?.create_fl === 'N'
              }
            >
              <Save color={'success'} />
            </ActionButton>
          )}

          <ActionButton
            // title={trans('buttons.search') + ' (Alt+8/F8)'}
            color={'info'}
            onClick={props.searchFormHandler}
            disabled={
              props.readonly == true ||
              props.searchFormHandler == undefined ||
              // props.permission?.read_fl === 'N' ||
              props.loading
            }
          >
            <Search color={'info'} />
          </ActionButton>
          <ActionButton
            // title={trans('buttons.create_page') + ' (Alt+9)'}
            color={'info'}
            onClick={props.createPageHandler}
            disabled={props.readonly == true || props.createPageHandler == undefined}
          >
            <Add color={'info'} />
          </ActionButton>
        </ButtonGroup>
        {/* Form Buttons Group End */}
      </Box>
    </StickyBar>
  );
}

export default TitleBar;
