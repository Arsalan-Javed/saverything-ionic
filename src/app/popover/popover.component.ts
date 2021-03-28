import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  parentRef: any;
  item:any;
  constructor(private popover: PopoverController,public params: NavParams) { }

  ngOnInit() {}

  setSize(size){

    this.parentRef = this.params.get('parentRef');
    this.item = this.params.get('item');
    this.item['size'] = size;
    this.popover.dismiss();
  }

}
