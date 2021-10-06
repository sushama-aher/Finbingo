import { TestBed } from '@angular/core/testing';

import { CommonMessageTransferService } from './common-message-transfer.service';

describe('CommonMessageTransferService', () => {
  let service: CommonMessageTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMessageTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
