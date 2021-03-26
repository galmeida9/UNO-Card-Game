import React, { useContext, useEffect } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent, BackCard } from './Cards';
import { makeStyles } from '@material-ui/core/styles';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Player(props) {
    const [cards, setCards] = React.useState([]);
    // show cards
    const [show, setShow] = React.useState(false);
    const [initialize, setInitialize] = React.useState(true);
    const [id, setId] = React.useState(0);

    const classes = useStyles();
    const context = useContext(DeckContext);

    useEffect(async () => {
        if (initialize) initializePlayer();
        // if it is the real player
        else if (context.player === id && context.addCard) addCard();
        // if it is a Bot
        else if (context.player === id && !show) {
            // TODO random time
            await sleep(2000);
            makeMove();
        }

    }, [context.addCard, cards.length, context.player])

    const initializePlayer = () => {
        let initial = [];
        for (let i = 0; i < 7; i++) {
            let index = Math.floor(Math.random() * context.deck.length);
            initial.push(context.deck[index]);
            context.remove(index);
        }

        setCards(initial);
        setShow(props.Show);
        setInitialize(false);
        setId(props.Id);
    }

    // gets the class to place the cards in the correct position
    const getClass = () => {
        switch (props.Position) {
            case "top":
                return classes.top;
            default:
                return classes.bottom;
        }
    }

    const placeCard = (index) => {
        let card = cards[index];
        if ((card.color === props.Card.color || card.color === "black" || card.number === props.Card.number) &&
            context.player === id) {
            context.changeCard(card);
            cards.splice(index, 1);
            setCards(cards);

            // TODO more than one play at a time
            if (id == 0) context.next();
        }
    }

    const addCard = () => {
        let index = Math.floor(Math.random() * context.deck.length);
        context.remove(index);
        cards.push(context.deck[index]);
        setCards(cards);
        context.setAddCard(false);
    }

    // Bot AI
    const makeMove = () => {
        let possibleMoves = [];
        cards.forEach((card, index) => {
            let currMove = [];

            // Card with the same color or same number
            if (card.color === props.Card.color || card.number === props.Card.number) {
                currMove.push(index);

                // Check for other cards with the same number
                cards.forEach((card2, index2) => {
                    if (card2.number === card.number && index != index2) currMove.push(index2)
                })
            }
            // Card with the same number
            else if (card.color === "black") {
                currMove.push(index);
            }
            // TODO: black card on the table, check that color

            if (currMove.length != 0) possibleMoves.push(currMove);
        })

        if (possibleMoves.length == 0) {
            addCard();
            makeMove();
        } else {
            // TODO: use longest move
            let index = Math.floor(Math.random() * possibleMoves.length);
            console.log(possibleMoves[index]);
            possibleMoves[index].forEach((i) => { placeCard(i) });
            context.next();
        }
    }

    return (
        <Grid container className={getClass()}>
            {cards.map((card, index) => {
                if (show) {
                    return (
                        <CardComponent
                            key={index}
                            Card={card}
                            onClick={() => { placeCard(index) }}
                            className={classes.card}
                        />
                    );
                } else {
                    return (
                        <BackCard key={index} className={classes.card} />
                    );
                }
            })}
        </Grid>
    );
}

const useStyles = makeStyles((theme) => ({
    top: {
        textAlign: 'center',
        position: 'absolute',
        userSelect: 'none',
        display: 'inline-block',
        top: '0'
    },
    bottom: {
        textAlign: 'center',
        position: 'absolute',
        userSelect: 'none',
        display: 'inline-block',
        bottom: '0'
    },
    card: {
        marginLeft: '-30pt'
    }

}));