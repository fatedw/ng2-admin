/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { List } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { DocsService } from './docs.service';
import { NgaMenuService, NgaMenuItem } from '@akveo/nga-theme';
import { NgaMenuInternalService } from '@akveo/nga-theme/components/menu/menu.service';

import 'rxjs/add/operator/filter';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'react-docs',
  styleUrls: ['docs.component.scss'],
  template: `
     <nga-layout>
      <nga-layout-header fixed>
        <react-header></react-header>
      </nga-layout-header>
      <nga-sidebar>
        <nga-sidebar-content>
          <nga-menu [items]="menuItems" tag="leftMenu"></nga-menu>
        </nga-sidebar-content>
      </nga-sidebar>
      <nga-layout-column>
        <router-outlet></router-outlet>
      </nga-layout-column>
    </nga-layout>
  `,
})
export class ReactDocsComponent implements OnDestroy {

  structure: any;
  menuItems: List<NgaMenuItem> = List([]);
  private menuItemSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(private service: DocsService,
              private router: Router,
              private menuInternalService: NgaMenuInternalService) {

    this.menuItems = this.service.getPreparedMenu();
    this.structure = this.service.getPreparedStructure();

    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event['url'] === '/docs') {
          let firstMenuItem = this.menuItems.get(0).children.get(0);
          this.menuInternalService.itemSelect(firstMenuItem);
          this.router.navigateByUrl(firstMenuItem.link, { replaceUrl: true });
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
