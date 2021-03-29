import React, { useContext, useEffect, useRef } from 'react';
import DeckContext from './DeckContext';
import Grid from '@material-ui/core/Grid';
import { CardComponent, BackCard, colors, specialCards } from './Cards';
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
    // force the component to refresh, in order to load new cards
    const [refresh, setRefresh] = React.useState(false);

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

    useEffect(() => {
        if (initialize) initializePlayer();
        // if it is a Bot
        else if (context.player === id) {
            if (context.specials.length > 0) {
                readSpecials();
            } else {
                // TODO random time
                sleep(1000).then(() => { makeMove(); });
            }
        }

    }, [context.addCard, context.player, animation, refresh])

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
        context.setColor(card.color);

        if ([specialCards.PLUS2, specialCards.PLUS4, specialCards.INVERT].includes(card.number)) {
            let newSp = context.specials;
            newSp.push(card.number);
            context.setSpecials(newSp);
            context.setColor(chooseColor());
        } else if (card.number === specialCards.CHANGE_COLOR) {
            context.setColor(chooseColor());
        }

        setTimeout(() => {
            setAnimation(true);
        }, 100);

        setTimeout(() => {
            context.changeCard(card);
            cards.splice(index, 1);
            setCards(cards);
            setAnimation(false);
        }, 1000);
    }

    const getTranslationX = (index) => {
        console.log(index);
        console.log(cardsRefs.current);
        let posX = cardsRefs.current[index].getBoundingClientRect().x;
        return window.innerWidth / 2 - posX - 127;
    }

    const addCard = async () => {
        let index = Math.floor(Math.random() * context.deck.length);
        cards.push(context.deck[index]);
        context.remove(index);
        await setCards(cards);
        console.log(cards);
        setRefresh(prev => !prev);
    }

    // Bot AI
    const makeMove = async () => {
        let possibleMoves = [];
        let currCard = context.card;
        setPlayedCard(null);

        cards.forEach((card, index) => {
            let currMove = [];

            // Card with the same color or same number
            if (card.color === currCard.color || card.number === currCard.number) {
                currMove.push(index);

                // Check for other cards with the same number
                cards.forEach((card2, index2) => {
                    if (card2.number === card.number && index !== index2) currMove.push(index2)
                })
            } else if (card.number === specialCards.CHANGE_COLOR) {
                currMove.push(index);
            } else if (card.number === specialCards.PLUS4) {
                currMove.push(index);

                // Check for other cards with the same number
                cards.forEach((card2, index2) => {
                    if (card2.number === card.number && index !== index2) currMove.push(index2)
                })
            }

            if (currMove.length !== 0) possibleMoves.push(currMove);
        })

        if (possibleMoves.length === 0) {
            console.log("no moves");
            await addCard();
            // makeMove();
        } else {
            // TODO: use longest move
            let index = Math.floor(Math.random() * possibleMoves.length);
            // possibleMoves[index].forEach((i) => { placeCard(i); sleep(2000) });

            for (let i = 0; i < possibleMoves[index].length; i++) {
                placeCard(possibleMoves[index][i]);
                sleep(2000);
            }

            context.next();
        }
    }

    const chooseColor = () => {
        if (Math.random() <= 0.8) {
            return getMostHadColor();
        } else {
            const availableColors = [colors.RED, colors.BLUE, colors.GREEN, colors.YELLOW];
            return availableColors[Math.floor(Math.random() * colors.length)];
        }
    }

    const getMostHadColor = () => {
        let color = null;
        let max = 0;
        let count = { [colors.RED]: 0, [colors.BLUE]: 0, [colors.GREEN]: 0, [colors.YELLOW]: 0 };

        cards.forEach((card) => {
            count[card.color] = count[card.color] + 1;
            if (count[card.color] > max) {
                max = count[card.color];
                color = card.color;
            }
        });

        return color;
    }

    const readSpecials = () => {
        console.log(context.specials)
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

    return (
        <Grid container className={getClass()}>
            {cards.map((card, index) => {
                if (playedCard === card) {
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