import React, { useContext, useEffect, useRef } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent } from './Cards';
import { makeStyles } from '@material-ui/core/styles';

export default function Player(props) {
    // cards in hand
    const [cards, setCards] = React.useState([]);
    // initialize the player or not
    const [initialize, setInitialize] = React.useState(true);
    // player ID
    const [id, setId] = React.useState(0);
    // player last played card
    const [playedCard, setPlayedCard] = React.useState(null);
    // played card position
    const [xposition, setXposition] = React.useState(0);

    const useStyles = makeStyles((theme) => ({
        root: {
            textAlign: 'center',
            position: 'absolute',
            userSelect: 'none',
            display: 'inline-block',
            bottom: '0'
        },
        card: {
            marginLeft: '-30pt',
        },
        cardAnimation: {
            position: 'fixed',
            margin: '0',
            transform: `translate(${xposition}px, ${ -(window.innerHeight / 2 - 84)}px)`,
            transition: 'all 1s'
        }
    }));

    const classes = useStyles();
    const context = useContext(DeckContext);
    const cardsRefs = useRef([]);

    useEffect(async () => {
        if (initialize) initializePlayer();
        // if it is the real player
        else if (context.player === id && context.addCard) addCard();
        // reset user's last played card
        else if (context.player != id && playedCard != null) setPlayedCard(null);

    }, [context.addCard, cards.length, context.player])

    const initializePlayer = () => {
        let initial = [];
        for (let i = 0; i < 7; i++) {
            let index = Math.floor(Math.random() * context.deck.length);
            initial.push(context.deck[index]);
            context.remove(index);
        }

        setCards(initial);
        setInitialize(false);
        setId(props.Id);
    }

    const placeCard = (index) => {
        let card = cards[index];
        if (canPlaceCard(card)) {
            setXposition(getTranslationX(index));
            setPlayedCard(card);

            setTimeout(() => {
                context.changeCard(card);
                cards.splice(index, 1);
                setCards(cards);
            }, 1000);
        }
    }

    const getTranslationX = (index) => {
        let posX = cardsRefs.current[index].getBoundingClientRect().x;
        return window.innerWidth / 2 - posX - 127;
    }

    const canPlaceCard = (card) => {
        let currCard = context.card;
        return (playedCard != null && playedCard.number === card.number) ||
            (playedCard == null && (card.color === currCard.color || card.color === "black" || card.number === currCard.number))
    }

    const addCard = () => {
        let index = Math.floor(Math.random() * context.deck.length);
        context.remove(index);
        cards.push(context.deck[index]);
        setCards(cards);
        context.setAddCard(false);
    }

    return (
        <Grid container className={classes.root}>
            {cards.map((card, index) => {
                return (
                    <CardComponent
                        key={index}
                        Card={card}
                        onClick={() => { placeCard(index); }}
                        className={playedCard == card ? classes.cardAnimation : classes.card}
                        ref={(el) => cardsRefs.current[index] = el}
                    />
                );
            })}
        </Grid>
    );
}