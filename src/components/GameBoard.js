import React, { useEffect } from 'react';
import { BackCard, getDeck, CardComponent, colors } from './Cards';
import Player from './Player';
import Bot from './Bot';
import { makeStyles } from '@material-ui/core/styles';
import DeckContext from './DeckContext';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ReplayIcon from '@material-ui/icons/Replay';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function GameBoard(props) {
    const [deck, setDeck] = React.useState([]);
    const [currCard, setCurrCard] = React.useState(null);
    const [addCard, setAddCard] = React.useState(false);
    const [players, setPlayers] = React.useState([0, 1]);
    const [currPlayer, setCurrPlayer] = React.useState(0);
    const [specials, setSpecials] = React.useState([]);
    const [color, setColor] = React.useState(null);
    const [alert, setAlert] = React.useState(true);
    const [invert, setInvert] = React.useState(false);

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
        if (cards[index].color === colors.BLACK) {
            initializeCards();
        } else {
            setCurrCard(cards[index]);
            setColor(cards[index].color)
            setDeck(cards);
        }
    }

    const changeCard = (card) => {
        setCurrCard(card);
    }

    const nextPlayer = () => {
        let nxtPlayer = !invert ? Math.abs(currPlayer + 1) % 2 : Math.abs(currPlayer - 1) % 2;
        setCurrPlayer(nxtPlayer);
        nxtPlayer === 0 ? setAlert(true) : setAlert(false);
    }

    const handleClose = () => {
        setAlert(false);
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
                    color: color,
                    remove: removeCard,
                    changeCard: changeCard,
                    setAddCard: setAddCard,
                    next: nextPlayer,
                    setSpecials: setSpecials,
                    setColor: setColor,
                    setInvert: setInvert
                }
                }>
                <div className={classes.root}>
                    <Snackbar open={alert} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleClose} style={{ color: 'black', backgroundColor: 'white' }}>
                            Your Turn!
                        </Alert>
                    </Snackbar>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} color="textPrimary" gutterBottom>
                                Current Player: {currPlayer}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Color: {color}
                            </Typography>
                        </CardContent>
                    </Card>
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
    },
    card: {
        width: '170pt',
        position: 'absolute',
        top: '10pt',
        left: '10pt'
    },
    title: {
        fontSize: 24,
    },
}));