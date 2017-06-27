export enum Languages {
  Chinese = 0,
  English,
}

export class LanguageService {
  private language: Languages;
  private static instance: LanguageService;
  constructor() {
    this.language = Languages.English;
  }
  
  // only Chinese and English support for now 
  public switchLanguage() {
    if (this.language === Languages.Chinese) {
      this.language = Languages.English;
    } else {
      this.language = Languages.Chinese;
    }
  }

  public getLanguage() {
    return this.language;
  }

  public static get getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }
}
