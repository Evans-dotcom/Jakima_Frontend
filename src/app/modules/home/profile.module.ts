// modules/profile/profile.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  declarations: [
    // EMPTY - ProfileComponent is standalone
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    
    // IMPORT standalone component here
    ProfileComponent
  ]
})
export class ProfileModule { }