const treeData = [{
  "node": "The Avengers",
  "description": "A team of superheroes, each with their own unique powers and skills.",
  "link": "https://www.mountainroseherbs.com",
  "image": "test.jpg",
  "cardType": "primary",
  "badge": "star",
  "children": [
    {
      "node": "Bruce Banner / The Hulk",
      "description": "A brilliant scientist who transforms into a green behemoth when enraged.",
      "link": "",
      "image": "test.jpg",
      "cardType": "primary",
      "badge": "",
      "children": [
        {
          "node": "Tony Stark / Iron Man",
          "description": "Genius inventor in a high-tech suit of armor, witty and resourceful.",
          "link": "",
          "image": "test.jpg",
          "cardType": "secondary",
          "badge": "triangle",
          "children": [
            {
              "node": "Natasha Romanoff / Black Widow",
              "description": "Expert spy and martial artist with a mysterious past.",
              "link": "https://www.mountainroseherbs.com",
              "image": "test.jpg",
              "cardType": "primary",
              "badge": "",
              "children": [
                {
                  "node": "Clint Barton / Hawkeye",
                  "description": "Master archer with unmatched precision and calm under pressure.",
                  "link": "",
                  "image": "test.jpg",
                  "cardType": "secondary",
                  "badge": "",
                  "children": []
                },
                {
                  "node": "Sam Wilson / Falcon",
                  "description": "Aerial combatant with mechanical wings and a loyal heart.",
                  "link": "",
                  "image": "test.jpg",
                  "cardType": "primary",
                  "badge": "",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "node": "Thor Odinson",
          "description": "God of Thunder wielding the mighty hammer Mjolnir.",
          "link": "",
          "image": "test.jpg",
          "cardType": "primary",
          "badge": "circle",
          "children": [
            {
              "node": "Loki Laufeyson",
              "description": "Trickster god, master of illusions and mischief.",
              "link": "",
              "image": "test.jpg",
              "cardType": "secondary",
              "badge": "",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "node": "Steve Rogers / Captain America",
      "description": "Super soldier and moral compass of the Avengers.",
      "link": "",
      "image": "test.jpg",
      "cardType": "primary",
      "badge": "circle",
      "children": [
        {
          "node": "Bucky Barnes / Winter Soldier",
          "description": "Long-lost friend turned formidable ally with a metal arm.",
          "link": "",
          "image": "test.jpg",
          "cardType": "secondary",
          "badge": "",
          "children": []
        },
        {
          "node": "Shuri",
          "description": "Genius princess of Wakanda, skilled in tech and innovation.",
          "link": "",
          "image": "test.jpg",
          "cardType": "primary",
          "badge": "",
          "children": []
        }
      ]
    }
  ]
}];

export default treeData;
