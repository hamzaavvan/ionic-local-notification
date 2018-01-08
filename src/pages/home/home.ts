import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;
  isScheduled: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications) {
    this.notifyTime = moment(new Date()).format();

    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();

    this.days = [
      {title: "Monday", dayCode: 1, checked: false},
      {title: "Tuesday", dayCode: 1, checked: false},
      {title: 'Wednesday', dayCode: 3, checked: false},
      {title: 'Thursday', dayCode: 4, checked: false},
      {title: 'Friday', dayCode: 5, checked: false},
      {title: 'Saturday', dayCode: 6, checked: false},
      {title: 'Sunday', dayCode: 0, checked: false}
    ];


    
    this.localNotifications.schedule({
      id: 99,
      text: 'Single ILocalNotification',
    });
  }

  ionViewDidLoad() {}

  timeChange(time) {
    this.chosenHours = time.hour.value;
    this.chosenMinutes = time.minute.value;
  }

  addNotification() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

    console.log(this.isScheduled)

    for (let day of this.days) {
      if (day.checked) {
        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;
        
        console.log("selected day: ", day.dayCode);
        console.log("Current day: ", currentDay);
        
        if (dayDifference < 0) {
          dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        console.log(dayDifference);

        firstNotificationTime.setHours(firstNotificationTime.getHours() + (3600 * (dayDifference)));
        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);

        console.log(new Date(new Date().getTime() + (3600*2)));
        console.log(new Date(firstNotificationTime.getTime()));

        this.isScheduled = true;
        
        let notification = {
          id: day.dayCode,
          title: "Hey!",
          text: `It's ${day.title}, lets have a fun`,
          at: firstNotificationTime,
          every: "week"
        };

        this.notifications.push(notification);
      }
    }

    if (this.platform.is("android") && this.notifications.length > 0) {
      // cancel any existing notifications
      this.localNotifications.cancelAll().then(() => {

        // Schedule the new notifications
        this.localNotifications.schedule(this.notifications);

        this.notifications = [];

        let alert = this.alertCtrl.create({
          title: "Notifications set",
          buttons: ["Ok"],
        });

        alert.present();
      });
    }
  }

  cancelAll() {
    this.localNotifications.cancelAll();

    let alert = this.alertCtrl.create({
      title: "Notifications cancelled",
      buttons: ["Ok"]
    });

    this.isScheduled = false;

    this.days.forEach(day => {
      day.checked = false;  
    });

    alert.present();
  }

}
