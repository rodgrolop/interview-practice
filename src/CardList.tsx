
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { useNavigate } from 'react-router-dom';
import {
  getCards,
  selectCards,
  removeCard,
  setEditCard,
  filterCards
} from './redux/reducer';

import {sendEventFirstProvider, sendEventSecondProvider} from './analytics/analytics';

import makeStyles from '@mui/styles/makeStyles';

// Layout MUI resources
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 60,
        paddingBottom: 90
    },
    input: {
        marginTop: "15px !important",
        marginBottom: "15px !important",
    },
    image: {
        display: 'flex',
        width: '100%',
        height: "auto"
    },
    name: {        
        textAlign: 'center',
    },
    buttons: {
        textAlign: 'center'
    },
    emptyList: {
        textAlign: 'center'
    },
    pagination: {
        marginTop: 30,
        justifyContent:"center",
        display:'flex'
    }
  }));

const CardList = () => {  
  const classes = useStyles();
  const navigate = useNavigate();
  const [remove, setRemove] = useState({open: false, card: null});  
  const [page, setPage] = useState(1);
  const [local_cards, setLocalCards] = useState([])
  const { cards, filtered_cards, search, status } = useAppSelector(selectCards);
  const dispatch = useAppDispatch();
  
  const editCard = (card : Object) => {
    dispatch(setEditCard({...card}));
    navigate('/card_edit');
  };
  
  const handleSearch = event => {
    dispatch(filterCards(event.target.value))
  }
  
  const removeCardFromList = () => {
      dispatch(removeCard(remove.card._id));
      setRemove({open: false, card: null});      
      sendEventFirstProvider('button click', {button: "accept remove button"});
      sendEventSecondProvider('button click', {button: "accept remove button"});   
  };
  
  useEffect(() => {
    !cards.length && dispatch(getCards());
  }, []);
  
  useEffect(() => {
    filtered_cards.length || search !== "" ? setLocalCards(filtered_cards) : setLocalCards(cards);
  }, [filtered_cards, cards]);
  
  return (
    <>        
        {status === 'loading' ? <LinearProgress color="secondary"/> : null}
        <Container maxWidth="lg" className={classes.container}>
            <Box sx={{ flexGrow: 1 }}>
              <TextField 
                id="outlined-basic" 
                label="Search Card" 
                variant="outlined"  
                value={search} 
                fullWidth autoFocus={false} 
                className={classes.input} 
                onChange={handleSearch}
                />          
                <Grid container spacing={2}>
                    {local_cards.length && status !== 'loading' ? local_cards.slice((page - 1) * 12, page * 12).map((card, index) => 
                        <Grid item md={3} sm={4} xs={12} key={index}>
                            <Card>
                                <img
                                  className={classes.image}
                                  src={card.imageUrl}
                                  alt={card.name}
                                  loading="lazy"
                                />
                            </Card>
                            <Typography variant="h6" color="secondary" className={classes.name}>{card.name}</Typography>
                            <div className={classes.buttons}>
                                <IconButton aria-label="edit" onClick={() => {                                
                                  editCard(card)
                                  sendEventFirstProvider('button click', {button: "edit button"});
                                  sendEventSecondProvider('button click', {button: "edit button"});  }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="remove" onClick={() => {
                                  setRemove({open: true, card: card})
                                  sendEventFirstProvider('button click', {button: "remove button"});
                                  sendEventSecondProvider('button click', {button: "remove button"});}}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Grid>) 
                    : !local_cards.length && status !== 'loading' ? 
                    <div className={classes.emptyList}>
                        <Typography variant="h6" color="secondary" className={classes.name}>{"No Results"}</Typography>
                    </div> 
                    : null}    
                </Grid>    
            </Box>
            {/* Pagination */}
            {local_cards.length && status !== 'loading' ?
                <div className={classes.pagination}>
                      <Pagination count={Math.ceil(local_cards.length / 12)} page={page} onChange={(event, value) => {
                        sendEventFirstProvider('button click', {button: `page ${value} button`});
                        sendEventSecondProvider('button click', {button: `page ${value} button`});  
                        setPage(value)}} color="secondary" />
                </div>
            : null}
            {/* Card removing dialog */}
            <Dialog
              open={remove.open}
              onClose={() => setRemove({open: false, card: null})}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {remove.card?.name ? `Are you sure you want to remove ${remove.card.name}?` : null}
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => {
                  sendEventFirstProvider('button click', {button: "cancel remove button"});
                  sendEventSecondProvider('button click', {button: "cancel remove button"});
                  setRemove({open: false, card: null})}}>Cancel</Button>
                <Button onClick={() => removeCardFromList()} autoFocus>Accept</Button>
              </DialogActions>
            </Dialog>
        </Container>
    </>
  );
}

export default CardList;
