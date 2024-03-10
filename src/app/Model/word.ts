export interface IWord {
    word: string;
    phonetics:[
        {
            audio:string;
            sourceUrl:string;
            text:string;
        }
    ];
    meanings: [
        {
            partOfSpeech: string,
            definitions: [
                {
                    definition: string
                }
            ],
            synonyms: string[],
            antonyms: string[]
        }
    ],
    sourceUrls: string[],
    searchedUser:string,
    time:string,
}

export interface ICounter{
    counter:number;
}
