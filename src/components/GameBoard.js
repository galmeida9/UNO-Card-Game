import React, { useEffect } from 'react';
import { BackCard, getDeck, CardComponent } from './Cards';
import Player from './Player';
import { makeStyles } from '@material-ui/core/styles';
import DeckContext from './DeckContext';

export default function GameBoard(props) {
    const [deck, setDeck] = React.useState([]);
    const [currCard, setCurrCard] = React.useState(null);

    const classes = useStyles();

    useEffect(() => {
        setDeck(getDeck());
        getInitialCard();
    }, [])

    const removeCard = (index) => {
        deck.splice(index, 1);
        setDeck(deck);
    }

    const getInitialCard = () => {
        let index = Math.floor(Math.random() * deck.length);
        setCurrCard(deck[index]);
        removeCard(index);
    }

    if (deck.length > 0 && currCard != null) {
        return (
            <DeckContext.Provider
                value = {{
                    deck: deck,
                    remove: removeCard
                }
            }>
                <div className={classes.root}>
                    <CardComponent Card={currCard} className={classes.centerCard} />
                    <BackCard className={classes.deck} />
                    <Player />
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
    }
}));