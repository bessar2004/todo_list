import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AppLanguage,
  LanguageService
} from '../../services/language';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})

export class AuthLayout {

readonly languageOptions: {
    code: AppLanguage;
    label: string;
  }[] = [
    {
      code: 'tr',
      label: 'TR'
    },
    {
      code: 'en',
      label: 'EN'
    },
    {
      code: 'ar',
      label: 'AR'
    }
  ];

  constructor(
    public language: LanguageService
  ) {}

  // dili  degistir 
  setLanguage(language: AppLanguage): void {
    this.language.setLanguage(language);
  }




}
