import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchWordService } from '../Services/search-word.service';
import { IWord } from '../Model/word';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BookmarkwordsService } from '../Services/bookmarkwords.service';
import { HistoryServiceService } from '../Services/history-service.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: '[app-search-result]',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})

export class SearchResultComponent implements OnInit, OnDestroy {



  searchedWord: FormControl = new FormControl();
  wordDetails: IWord[] = [];
  phonetics: any[] = [];
  meaning: any[] = [];
  partsOfSpeech: string[] = [];
  otherMeanings: string[] = [];
  otherMeaningsString!: string;
  whatsAppUrl: string | undefined;
  showSpinner: boolean = false;
  IsBookMarked: boolean = true;
  loggedInUser: string = "";

  constructor(private _searchWord: SearchWordService, private _snackBar: MatSnackBar, private _route: ActivatedRoute,
    private _bookMark: BookmarkwordsService, private _history: HistoryServiceService, private _auth: AuthService) { }

  ngOnDestroy(): void {
    this._snackBar.ngOnDestroy();
  }

  ngOnInit(): void {
    if (this._auth.getUser() != null) {
      this.loggedInUser = this._auth.getUser().userName;
    }
    this._route.queryParams.subscribe(data => {
      if (Object.keys(data).length > 0) {
        this.searchedWord.setValue(data['word']);
        this.getWordDetails()
      }
    })
  }

  inputKeys(event: any) {
    if (event.key == "Enter") {
      this.getWordDetails();
    }
  }

  getWordDetails() {

    this.whatsAppUrl = undefined;
    this.IsBookMarked = true;
    this.wordDetails = [];
    this.partsOfSpeech = [];
    this.phonetics = [];
    this.meaning = [];
    this.otherMeanings = [];
    this.showSpinner = true;

    if (!this.searchedWord.value) {
      this._snackBar.open("please enter word", "Dismiss");
      return;
    }

    this.whatsAppUrl = `https://api.whatsapp.com/send?text=${location.href}?word=${this.searchedWord.value}`;
    this._searchWord.getWordFormFireBase(this.searchedWord.value.toLowerCase()).subscribe({
      next: (data) => {
        this.showSpinner = false;
        if (data != null) {
          this.transformWordDetails(data);
          console.log("took from firebase");
        } else {
          this.getWordDetailsFromDictionaryApi(this.searchedWord.value.toLocaleLowerCase());
          console.log("took from dictionary api");
        }
      },
      error: (error) => {
        this.showSpinner = false;
        console.log(error);
      }
    })
  }

  updateCounter() {
    this._searchWord.getCounter().subscribe(data => {
      this.setCounter(data + 1);
    })
  }

  setCounter(counter: number) {
    this._searchWord.setCounter(counter).subscribe(data => {
      this._searchWord.counterValue = data as number;
    })
  }



  IsWordExistsInHistory(userName: string, wordDetails: Array<IWord>) {
    this._history.getHistory(userName).subscribe({
      next: (data) => {
        if (data != null) {
          if (Object.keys(data).find(x => x != this.searchedWord.value.toLowerCase())) {
            const date = new Date();
            wordDetails[0].time = date.toLocaleString();
            this._history.searchedHistory = wordDetails[0];
            this.postToHistoryDB(userName);
          }
        } else {
          const date = new Date();
          wordDetails[0].time = date.toLocaleString();
          this._history.searchedHistory = wordDetails[0];
          this.postToHistoryDB(userName);
        }
      }
    })
  }

  postToHistoryDB(userName: string) {
    let wordInfo: Array<IWord> = [];
    if (this.wordDetails.length > 1) {
      wordInfo.unshift(this.wordDetails[0]);
    } else {
      wordInfo = this.wordDetails;
    }
    this._history.putSearchWordToFireBase(userName, wordInfo).subscribe({
      next: _ => {
        console.log("History Posted to firebase ");
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getWordDetailsFromDictionaryApi(word: string) {
    this._searchWord.getWord(word).subscribe({
      next: data => {
        this.transformWordDetails(data);
        this.putWordIntoFirebase(word, data);
      },
      error: error => {
        console.log(error);
        this._snackBar.open("Please enter correct word!!!", "Dismiss")
      }
    })
  }

  putWordIntoFirebase(word: string, wordDetails: Array<IWord>) {
    this._searchWord.putWordToFireBase(wordDetails, word).subscribe({
      next: data => {
        console.log(word.toUpperCase() + " Posted to firebase ");
      },
      error: error => {
        console.log(error);
      }
    })
  }

  transformWordDetails(data: Array<IWord>) {
    this.wordDetails = data.flat();
    console.log(this.wordDetails[0]);
    for (let i = 0; i < this.wordDetails[0].phonetics.length; i++) {
      this.phonetics.push(this.wordDetails[0].phonetics[i]);
    }
    for (let j = 0; j < this.wordDetails[0].meanings.length; j++) {
      this.partsOfSpeech.push(this.wordDetails[0].meanings[j].partOfSpeech);

    }

    this.partsOfSpeech.push("antonyms");
    this.partsOfSpeech.push("synonyms");

    if (this.loggedInUser != "") {
      this.IsWordBookmarked();
      this.IsWordExistsInHistory(this.loggedInUser, data);
      this.updateCounter();
    }
  }

  volumeClicked(url: string) {
    console.log(url);
    new Audio(url).play();
  }

  selectedPartofSpeech(part: string, index: number) {
    this.meaning = [];
    this.otherMeanings = [];
    if (part !== "antonyms" && part !== "synonyms") {
      if (this.wordDetails[0].meanings[index].partOfSpeech == part) {
        this.meaning.push(this.wordDetails[0].meanings[index]);
      }
    }
    if (part === "antonyms") {
      for (let k = 0; k < this.wordDetails[0].meanings.length; k++) {
        if (this.wordDetails[0].meanings[k].antonyms) {
          for (let m = 0; m < this.wordDetails[0].meanings[k].antonyms.length; m++) {
            this.otherMeanings.push(this.wordDetails[0].meanings[k].antonyms[m])
          }
        }
      }
    }

    if (part === "synonyms") {
      for (let k = 0; k < this.wordDetails[0].meanings.length; k++) {
        if (this.wordDetails[0].meanings[k].synonyms) {
          for (let m = 0; m < this.wordDetails[0].meanings[k].synonyms.length; m++) {
            this.otherMeanings.push(this.wordDetails[0].meanings[k].synonyms[m])
          }
        }
      }
    }
  }

  IsWordBookmarked() {
    this._bookMark.getBookmarkWords(this.loggedInUser).subscribe(data => {
      if (data != null) {
        if (Object.keys(data).find(x => x == this.searchedWord.value.toLowerCase())) {
          this.IsBookMarked = false;
        }
      }
    })
  }

  bookMarked() {
    this._bookMark.getBookmarkWords(this.loggedInUser).subscribe(data => {
      if (data != null) {
        if (!Object.keys(data).find(x => x == this.searchedWord.value.toLowerCase())) {
          this.postWordToFirebase();
          this._searchWord.bookMarkWord = this.wordDetails[0];
          this.IsBookMarked = false;
          this._snackBar.open("Successfully bookmarked", "Dismiss");
        }
        else {
          this._snackBar.open("Already book marked please check in your book mark list", "Dismiss");
        }
      } else {
        this.postWordToFirebase();
        this._searchWord.bookMarkWord = this.wordDetails[0];
        this.IsBookMarked = (this.IsBookMarked) ? false : true;
        this._snackBar.open("Successfully bookmarked", "Dismiss");
      }

    });
  }

  removebookMarked() {
    this.IsBookMarked = true;
    this._bookMark.deleteBookMarkWord(this.searchedWord.value.toLowerCase(), this.loggedInUser).subscribe(_ => {
      this._snackBar.open("Removed from bookmarks", "Dismiss");
      this._searchWord.unMarkedWord = this.searchedWord.value.toLowerCase();
    })
  }

  postWordToFirebase() {
    let wordInfo: Array<IWord> = [];
    if (this.wordDetails.length > 1) {
      wordInfo.unshift(this.wordDetails[0]);
    } else {
      wordInfo = this.wordDetails;
    }
    this._bookMark.putBookmarkWordsInFirebase(this.loggedInUser, wordInfo).subscribe({
      next: (data) => {
        console.log("Posted to firebase !!");
      },
      error: error => {
        console.log(error);
        this._snackBar.open("Technical error occured while bookmarking please try after some time");
      }
    })
  }

}
