import { RecipeService } from './recipes/recipe.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { TextHighlightDirective } from './directives/text-highlight.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { UppercasePipe } from './pipes/uppercase.pipe';

import { AuthInterceptor } from './auth/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './store/root.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

    TextHighlightDirective,
    DropdownDirective,
    UppercasePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(rootReducer),
  ],
  providers: [
    RecipeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
