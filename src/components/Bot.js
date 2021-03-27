import React, { useContext, useEffect, useRef } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent, BackCard } from './Cards';
import { makeStyles } from '@material-ui/core/styles';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Player(props) {
    // cards in hand
    const [cards, setCards] = React.useState([]);
    // initialize the player or not
    const [initialize, setInitialize] = React.useState(true);
    // player ID
    const [id, setId] = React.useState(0);
    // player last played card
    const [playedCard, setPlayedCard] = React.useState(null);
    // show animation
    const [animation, setAnimation] = React.useState(false);
    // played card position
    const [xposition, setXposition] = React.useState(0);

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
            marginLeft: '-30pt',
        },
        cardAnimation: {
            position: 'fixed',
            margin: '0',
            transform: `translate(${xposition}px, ${window.innerHeight / 2 - 80}px)`,
            transition: 'all 1s'
        }
    }));

    const classes = useStyles();
    const context = useContext(DeckContext);
    const cardsRefs = useRef([]);

    useEffect(async () => {
        if (initialize) initializePlayer();
        // if it is a Bot
        else if (context.player === id) {
            // TODO random time
            await sleep(1000);
            makeMove();
        }

    }, [context.addCard, cards.length, context.player, animation])

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
        setXposition(getTranslationX(index));
        setPlayedCard(card);

        setTimeout(() => {
            setAnimation(true);
        }, 100);

        setTimeout(() => {
            context.changeCard(card);
            cards.splice(index, 1);
            setCards(cards);
        }, 1000);
    }

    const getTranslationX = (index) => {
        let posX = cardsRefs.current[index].getBoundingClientRect().x;
        return window.innerWidth / 2 - posX - 127;
    }

    const addCard = () => {
        let index = Math.floor(Math.random() * context.deck.length);
        context.remove(index);
        cards.push(context.deck[index]);
        setCards(cards);
    }

    // Bot AI
    const makeMove = () => {
        let possibleMoves = [];
        let currCard = context.card;
        cards.forEach((card, index) => {
            let currMove = [];

            // Card with the same color or same number
            if (card.color === currCard.color || card.number === currCard.number) {
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
            possibleMoves[index].forEach((i) => { placeCard(i); sleep(500) });
            context.next();
        }
    }

    return (
        <Grid container className={getClass()}>
            {cards.map((card, index) => {
                if (playedCard == card) {
                    return (
                        <CardComponent
                            key={index}
                            Card={card}
                            className={animation ? classes.cardAnimation : classes.card}
                        />
                    );
                } else {
                    return (
                        <BackCard
                            key={index}
                            className={classes.card}
                            ref={(el) => cardsRefs.current[index] = el}
                        />
                    );
                }
            })}
        </Grid>
    );
}