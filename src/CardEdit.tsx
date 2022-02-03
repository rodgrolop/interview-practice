
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { useNavigate } from 'react-router-dom';
import {
  selectCards,
  editCard
} from './redux/reducer';

import {sendEventFirstProvider, sendEventSecondProvider} from './analytics/analytics';

import makeStyles from '@mui/styles/makeStyles';

// Layout MUI resources
import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 60,
        paddingBottom: 90
    },
    input: {
        marginTop: "15px !important",
        marginBottom: "15px !important",
    },
    name: {        
      textAlign: 'center',
    },
  }));

const CardEdit = () => {  
  const classes = useStyles();  
  const navigate = useNavigate();
  const { editing_card } = useAppSelector(selectCards);
  const [form, setForm] = useState({
    name: "",
    imageUrl: ""
  })
  const dispatch = useAppDispatch();
  
  const handleNameChange = event => setForm({...form, name: event.target.value});
  const handleImgChange = event => setForm({...form, imageUrl: event.target.value});
  
  const handleEdit = () => {
    console.log("hola")
    dispatch(editCard({form: form, editing_card: editing_card}))    
    navigate(-1);
  }
  
  useEffect(() => editing_card && setForm({
    name: editing_card.name ?? '',
    imageUrl: editing_card.imageUrl ?? '',
  }), [editing_card])
  
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {editing_card ? 
          <>
            <Typography variant="h6" color="secondary" className={classes.name}>{editing_card?.name && `Editing ${editing_card.name}`}</Typography>
            <TextField 
              id="outlined-basic" 
              label="Card Name" 
              variant="outlined"  
              value={form.name} 
              fullWidth autoFocus={false} 
              className={classes.input} 
              onChange={handleNameChange}
              />
            <TextField 
              id="outlined-basic" 
              label="Card Image" 
              variant="outlined" 
              value={form.imageUrl} 
              fullWidth 
              autoFocus={false} 
              className={classes.input}
              onChange={handleImgChange}/>
              
            {form.name !== "" && form.imageUrl !== "" ? <Button variant="contained" onClick={() => {
              handleEdit();
              sendEventFirstProvider('button click', {button: "save button"});
              sendEventSecondProvider('button click', {button: "save button"});  
              }}>SAVE</Button> : null}
          </> : 
          <Typography variant="h6" color="secondary" className={classes.name}>No card selected</Typography>
          }
        </Grid>    
      </Box>
    </Container>
  );
}

export default CardEdit;
