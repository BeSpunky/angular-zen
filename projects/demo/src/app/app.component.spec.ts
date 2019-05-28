import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CoreDemoModule } from './modules/core-demo/core-demo.module';
import { LoaderDemoModule } from './modules/loader-demo/loader-demo.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
        ],
        imports: [CoreDemoModule, LoaderDemoModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

//   it(`should have as title 'demo'`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('demo');
//   });

//   it('should render title in a h1 tag', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('h1').textContent).toContain('Welcome to demo!');
//   });
});
