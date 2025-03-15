import { TestBed } from '@angular/core/testing';
import { MainLayoutPage } from './main-layout.page';

describe('MainLayoutPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutPage],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MainLayoutPage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'mod51io' title`, () => {
    const fixture = TestBed.createComponent(MainLayoutPage);
    const app = fixture.componentInstance;
    expect('mod51io').toEqual('mod51io');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(MainLayoutPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, mod51io');
  });
});
