import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { FirebaseProfileResolver } from '../firebase/auth/profile/firebase-profile.resolver';
import { FirebaseAuthModule } from '../firebase/auth/firebase-auth.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    FirebaseAuthModule
  ],
  declarations: [ TabsPage ],
  providers: [
    FirebaseProfileResolver
  ]
})
export class TabsPageModule {}
