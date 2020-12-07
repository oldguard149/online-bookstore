import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPublisher } from 'src/app/shared/interfaces/interfaces';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-publisher-update',
  templateUrl: './publisher-update.component.html',
  styleUrls: ['./publisher-update.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class PublisherUpdateComponent implements OnInit {
  errorMsg: string[];
  publisher: IPublisher;
  private subs = new SubSink();
  constructor(
    private route: ActivatedRoute,
    private management: ManagementService
  ) { }

  ngOnInit(): void {
    const publisherId = this.route.snapshot.params['id'];
    this.subs.sink = this.management.getDetail('publisher', publisherId).subscribe(data => {
      this.publisher = data.publisher;
    })
  }

  getMessage(msgObject: any) {
    const {type, message} = msgObject;
    if (type === 'fail') {
      this.errorMsg = message;
    }
  }
}
