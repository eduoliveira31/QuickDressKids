import { TestBed } from '@angular/core/testing';

import { CustosService } from './custos';

describe('CustosService', () => {
  let service: CustosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
