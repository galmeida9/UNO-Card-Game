import React from 'react';

export class Card {
    constructor(color, number, img) {
        this.color = color;
        this.number = number;
        this.img = `${process.env.PUBLIC_URL}/assets/uno_cards/${img}.png`;
    }
}

export const colors = {
        BLUE: "blue",
        RED: "red",
        GREEN: "green",
        YELLOW: "yellow",
        BLACK: "black"
}

export const specialCards = {
    PLUS2: "p2",
    PLUS4: "plus4",
    FORBIDDEN: "f",
    INVERT: "t",
    CHANGE_COLOR: "changecolor"
}

export function getDeck() {
    const colorsArray = [colors.BLUE, colors.GREEN, colors.RED, colors.YELLOW];
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", specialCards.FORBIDDEN, specialCards.INVERT, specialCards.PLUS2];
    const specials = [specialCards.CHANGE_COLOR, specialCards.PLUS4];

    var deck = [];
    colorsArray.forEach(color => {
        numbers.forEach(num => {
            const card = new Card(color, num, color + num);
            deck.push(card);
            deck.push(card);
        });
    });

    specials.forEach(special => {
        const card = new Card(colors.BLACK, special, special);
        deck.push(card);
        deck.push(card);
        deck.push(card);
        deck.push(card);
    });

    return deck;
}

export const CardComponent = React.forwardRef((props, ref) => {
    return (
        <img
            src={props.Card.img}
            alt={props.Card.color + " " + props.Card.number}
            style={{ width: '80pt', borderRadius: '16px' }}
            className={props.className}
            onClick={props.onClick}
            ref={ref}
        />
    );
})

export const BackCard = React.forwardRef((props, ref) => {
    return (
        <img
            src={`${process.env.PUBLIC_URL}/assets/uno_back.png`}
            alt="Back Card"
            style={{ width: '78pt', padding: '1pt' }}
            className={props.className}
            onClick={props.onClick}
            ref={ref}
        />
    );
})