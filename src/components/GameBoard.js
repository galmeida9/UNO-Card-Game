import React, { useEffect } from 'react';
import { BackCard, getDeck, CardComponent } from './Cards';
import Player from './Player';
import Bot from './Bot';
import { makeStyles } from '@material-ui/core/styles';
import DeckContext from './DeckContext';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ReplayIcon from '@material-ui/icons/Replay';

export default function GameBoard(props) {
    const [deck, setDeck] = React.useState([]);
    const [currCard, setCurrCard] = React.useState(null);
    const [addCard, setAddCard] = React.useState(false);
    const [players, setPlayers] = React.useState([0, 1]);
    const [currPlayer, setCurrPlayer] = React.useState(0);
    const [specials, setSpecials] = React.useState([]);
    const [specialColor, setSpecialColor] = React.useState(null);

    const classes = useStyles();

    useEffect(() => {
        initializeCards();
    }, [])

    const removeCard = (index) => {
        deck.splice(index, 1);
        setDeck(deck);
    }

    const initializeCards = () => {
        const cards = getDeck();
        let index = Math.floor(Math.random() * cards.length);
        setCurrCard(cards[index]);
        setDeck(cards);
    }

    const changeCard = (card) => {
        setCurrCard(card);
    }

    const nextPlayer = () => {
        setCurrPlayer(prev => (prev + 1) % 2);
    }

    if (deck.length > 0 && currCard != null) {
        return (
            <DeckContext.Provider
                value={{
                    deck: deck,
                    card: currCard,
                    addCard: addCard,
                    player: currPlayer,
                    specials: specials,
                    specialColor: specialColor,
                    remove: removeCard,
                    changeCard: changeCard,
                    setAddCard: setAddCard,
                    next: nextPlayer,
                    setSpecials: setSpecials,
                    setSpecialColor: setSpecialColor
                }
                }>
                <div className={classes.root}>
                    <CardComponent Card={currCard} className={classes.centerCard} />
                    <BackCard className={classes.deck} onClick={() => { setAddCard(true) }} />
                    <Player Id={0} />
                    <Bot Position="top" Id={1} />
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.finishTurn}
                        endIcon={<SkipNextIcon />}
                        onClick={nextPlayer}
                    >
                        Finish Turn
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.undo}
                        endIcon={<ReplayIcon />}
                    >
                        Undo
                    </Button>
                </div>
            </DeckContext.Provider>
        );
    }
    else {
        return null;
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/background.jpg)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh'
    },
    centerCard: {
        justifyContent: "space-between",
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        userSelect: 'none'
    },
    deck: {
        justifyContent: "space-between",
        textAlign: 'center',
        position: 'absolute',
        left: '60%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        userSelect: 'none'
    },
    finishTurn: {
        position: 'absolute',
        bottom: '60pt',
        right: '20pt'
    },
    undo: {
        position: 'absolute',
        bottom: '20pt',
        right: '20pt'
    }
}));