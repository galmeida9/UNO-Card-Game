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

export function CardComponent({Card, className, onClick}) {
    return (
        <img
            src={Card.img}
            alt={Card.color + " " + Card.number}
            style={{ width: '80pt', borderRadius: '16px' }}
            className={className}
            onClick={onClick}
        />
    );
}

export function BackCard({className, onClick}) {
    return (
        <img
            src={`${process.env.PUBLIC_URL}/assets/uno_back.png`}
            alt="Back Card"
            style={{ width: '78pt', padding: '1pt' }}
            className={className}
            onClick={onClick}
        />
    );
}