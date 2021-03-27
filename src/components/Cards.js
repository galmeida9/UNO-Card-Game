import React from 'react';

export class Card {
    constructor(color, number, img) {
        this.color = color;
        this.number = number;
        this.img = `${process.env.PUBLIC_URL}/assets/uno_cards/${img}.png`;
    }
}

export function getDeck() {
    const colors = ["blue", "red", "green", "yellow"];
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "f", "t", "p2"];
    const specials = ["changecolor", "plus4"];

    var deck = [];
    colors.forEach(color => {
        numbers.forEach(num => {
            const card = new Card(color, num, color + num);
            deck.push(card);
            deck.push(card);
        });
    });

    specials.forEach(special => {
        const card = new Card("black", special, special);
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