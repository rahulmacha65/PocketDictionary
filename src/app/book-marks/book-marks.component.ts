import { Component, DoCheck, OnInit } from '@angular/core';
import { SearchWordService } from '../Services/search-word.service';
import { IWord } from '../Model/word';
import { BookmarkwordsService } from '../Services/bookmarkwords.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: '[app-book-marks]',
  templateUrl: './book-marks.component.html',
  styleUrls: ['./book-marks.component.css']
})
export class BookMarksComponent implements OnInit, DoCheck {

  constructor(private _searchWord: SearchWordService, private _bookmark: BookmarkwordsService, private _snack: MatSnackBar, private _auth: AuthService) { }
  bookMarkedWords: Array<IWord> = [];
  navigateTo!: string;
  loggedInUser!: string;
  ngDoCheck(): void {
    if (this._searchWord.bookMarkWord != null) {
      this.bookMarkedWords.unshift(this._searchWord.bookMarkWord);
      this._searchWord.bookMarkWord = null;
    }
    if (this._searchWord.unMarkedWord != null) {
      this.bookMarkedWords = this.bookMarkedWords.filter(item => item.word != this._searchWord.unMarkedWord);
      this._searchWord.unMarkedWord = null;
    }
  }

  wordClicked(selectedWord: string) {
    this.navigateTo = `${location.href.split('?')[0]}?word=${selectedWord}`;
  }

  ngOnInit(): void {
    if (this._auth.getUser() != null) {
      this.loggedInUser = this._auth.getUser().userName;
      this._bookmark.getBookmarkWords(this.loggedInUser).subscribe(data => {
        if (data) {
          data = Object.values(data).flat();
          data.forEach(item => {
            this.bookMarkedWords.push(item);
          });
        }
      });
    }
  }

  audioClicked(url: string) {
    new Audio(url).play();
  }

  removeFromBookMark(word: string) {
    this.bookMarkedWords = this.bookMarkedWords.filter(item => {
      if (item.word != word) {
        return true;
      }
      return false;
    });

    this._bookmark.deleteBookMarkWord(word, this.loggedInUser).subscribe(_ => {
      this._snack.open("Removed form book marks", "Dismiss");
    })

  }



}
