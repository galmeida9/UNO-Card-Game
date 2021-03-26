import React, { useContext, useEffect } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent } from './Cards';
import { makeStyles } from '@material-ui/core/styles';

export default function Player(props) {
    const [cards, setCards] = React.useState([]);

    const classes = useStyles();
    const context = useContext(DeckContext);

    useEffect(() => {
        getInitialCards();
    }, [])

    const getInitialCards = () => {
        let initial = [];
        for (let i = 0; i < 7; i++) {
            let index = Math.floor(Math.random() * context.deck.length);
            initial.push(context.deck[index]);
            context.remove(index);
        }

        setCards(initial);
    }

    return (
        <Grid container className={classes.root}>
            {cards.map((card, index) => {
                return (
                    <CardComponent key={index} Card={card} />
                );
            })}
        </Grid>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        position: 'absolute',
        bottom: '0',
        userSelect: 'none',
        display: 'inline-block'
    }
}));