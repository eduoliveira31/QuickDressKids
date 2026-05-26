import { TestBed } from '@angular/core/testing';

import { Custos } from './custos';

describe('Custos', () => {
  let service: Custos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Custos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
