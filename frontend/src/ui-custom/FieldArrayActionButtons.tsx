import React, { useState } from 'react';
import { Grid, Tooltip, Fab, Paper, Typography, ButtonGroup } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import { useTranslation } from 'react-i18next';
import ActionButton from './ActionButton';
import ConfirmationDialog from 'ui-component/ConfirmationDialog'; // Make sure this import path is correct

interface OwnershipActionsProps {
  onAdd: () => void;
  onDelete: (index: number) => void; // Updated to accept index for deletion
  currentIndex: number; // Current index of the data
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // State setter for currentIndex
  totalItems: number; // Total number of items
  title: string;
  disabled: boolean;
  showTitle?: boolean;
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

const FieldArrayActionButtons: React.FC<OwnershipActionsProps> = ({
  onAdd,
  onDelete,
  currentIndex,
  setCurrentIndex,
  totalItems,
  title,
  disabled,
  showTitle = true
}) => {
  // const [trans] = useTranslation();
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    index: -1
  });

  // Handle "Next" button click
  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handle "Previous" button click
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.index); // Call the onDelete prop with the index
    setDeleteConfirm({ open: false, index: -1 }); // Reset the confirmation state
  };

  return (
    <>
      <Paper
        sx={{
          marginBottom: '10px',
          padding: '5px 10px',
          borderRadius: '10px',
          width: '100%',
          margin: '0 0 10px 0'
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left Section: Typography (Title) */}
          <Grid>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: '500',
                padding: '0.2rem 0.4rem'
              }}
            >
              {title}
            </Typography>
          </Grid>

          {/* Right Section: Action Buttons */}
          <Grid>
            <Grid container spacing={1} alignItems="center">
              {/* Navigation Buttons */}
              <Grid>
                <ButtonGroup variant="text" sx={groupStyle}>
                  <ActionButton
                    // title={trans('buttons.previous') + ' (<)'}
                    color={'secondary'}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ArrowBack color={'secondary'} />
                  </ActionButton>
                  <ActionButton
                    sx={{
                      width: '56px',
                      fontSize: '14px'
                    }}
                    // title={trans('buttons.total')}
                    color={'secondary'}
                    disabled={true}
                  >
                    {`${currentIndex + 1} / ${totalItems}`}
                  </ActionButton>
                  <ActionButton
                    // title={trans('buttons.next') + ' (>)'}
                    color={'secondary'}
                    onClick={handleNext}
                    disabled={currentIndex === totalItems - 1}
                  >
                    <ArrowForward color={'secondary'} />
                  </ActionButton>
                </ButtonGroup>
              </Grid>

              {/* Other Action Buttons */}
              <Grid>
                <ActionButton
                  // title={trans('buttons.delete') + ' (Alt+2)'}
                  color={'error'}
                  onClick={() => setDeleteConfirm({ open: true, index: currentIndex })}
                  disabled={disabled}
                >
                  <DeleteIcon color={'error'} />
                </ActionButton>
              </Grid>
              <Grid>
                <ActionButton
                  //  title={trans('buttons.add') + ' (Alt+2)'}
                  color={'info'}
                  onClick={onAdd}
                  disabled={disabled}
                >
                  <AddIcon color={'info'} />
                </ActionButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirm.open}
        title="Delete"
        message={`Are you sure you want to delete ${title}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, index: -1 })}
      />
    </>
  );
};

export default FieldArrayActionButtons;
