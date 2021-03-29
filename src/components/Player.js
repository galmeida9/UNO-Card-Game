import React, { useContext, useEffect, useRef } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent, colors, specialCards } from './Cards';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

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
    // open model to choose color
    const [openModal, setOpenModal] = React.useState(false);

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
        modal: {
            color: 'white',
            textAlign: 'center',
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: '100pt',
            width: '100pt',
        },
        cardAnimation: {
            position: 'fixed',
            margin: '0',
            transform: `translate(${xposition}px, ${-(window.innerHeight / 2 - 85)}px)`,
            transition: 'all 1s'
        },
    }));

    const classes = useStyles();
    const context = useContext(DeckContext);
    const cardsRefs = useRef([]);

    useEffect(() => {
        if (initialize) initializePlayer();
        // check special cards played by previous players
        else if (context.player === id && context.specials.length > 0) readSpecials();
        // if it is the real player
        else if (context.player === id && context.addCard) addCard();
        // reset user's last played card
        else if (context.player !== id && playedCard != null) setPlayedCard(null);

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
            context.setColor(card.color);

            if ([specialCards.PLUS2, specialCards.PLUS4, specialCards.FORBIDDEN].includes(card.number)) {
                let newSp = context.specials;
                newSp.push(card.number);
                context.setSpecials(newSp);
            } else if (card.number === specialCards.INVERT) {
                context.setInvert(prev => !prev);
            }

            if (card.color === colors.BLACK) {
                setOpenModal(true);
            }

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
            (playedCard == null &&
                (card.color === context.color ||
                    card.color === colors.BLACK ||
                    card.number === currCard.number))
    }

    const addCard = () => {
        let index = Math.floor(Math.random() * context.deck.length);
        cards.push(context.deck[index]);
        context.remove(index);
        setCards(cards);
        context.setAddCard(false);
    }

    const readSpecials = () => {
        context.specials.forEach(sp => {
            switch (sp) {
                case specialCards.PLUS4:
                    addCard();
                    addCard();
                    addCard();
                    addCard();
                    break;
                case specialCards.PLUS2:
                    addCard();
                    addCard();
                    break;
                default:
                    return;
            }
        });

        context.setSpecials([]);
        context.next();
    }

    const changeColor = (color) => {
        context.setColor(color);
        setOpenModal(false);
    }

    return (
        <div>
            <Grid container className={classes.root}>
                {cards.map((card, index) => {
                    return (
                        <CardComponent
                            key={index}
                            Card={card}
                            onClick={() => { placeCard(index); }}
                            className={playedCard === card ? classes.cardAnimation : classes.card}
                            ref={(el) => cardsRefs.current[index] = el}
                        />
                    );
                })}
            </Grid>
            <Modal
                open={openModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}
            >
                <div style={{outline: 'none'}}>
                    <h1 style={{ marginTop: '15%' }}>Choose Color</h1>
                    <Grid container spacing={3} direction="row" alignItems="center" justify="center">
                        <Grid item >
                            <Paper className={classes.paper} style={{ backgroundColor: 'red' }} onClick={() => changeColor("red")}></Paper>
                        </Grid>
                        <Grid item >
                            <Paper className={classes.paper} style={{ backgroundColor: 'blue' }} onClick={() => changeColor("blue")}></Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} direction="row" alignItems="center" justify="center">
                        <Grid item >
                            <Paper className={classes.paper} style={{ backgroundColor: 'green' }} onClick={() => changeColor("green")}></Paper>
                        </Grid>
                        <Grid item >
                            <Paper className={classes.paper} style={{ backgroundColor: 'yellow' }} onClick={() => changeColor("yellow")}></Paper>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </div>
    );
}