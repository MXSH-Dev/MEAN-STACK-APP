import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private authListenerSubscription: Subscription;
  public userIsAuthenticated: boolean = false;
  constructor(private _autService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this._autService.getIsAuth();
    this.authListenerSubscription = this._autService
      .getAuthStatusListener()
      .subscribe((value) => {
        this.userIsAuthenticated = value;
        // console.log('AUTH?', this.userIsAuthenticated);
      });
  }
  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  onLogout(): void {
    this._autService.logout();
  }
}
