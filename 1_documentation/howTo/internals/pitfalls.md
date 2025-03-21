# Pitfalls

- [Pitfalls](#pitfalls)
  - [Do not add http interceptors by @Injectable](#do-not-add-http-interceptors-by-injectable)
  - [How to override style properties in angular material 18](#how-to-override-style-properties-in-angular-material-18)
  - [Avoid complex binding between Reactive form and the Object](#avoid-complex-binding-between-reactive-form-and-the-object)
  - [Log javascript File is tricky](#log-javascript-file-is-tricky)
  - [Trigger an event in a sibling when its sibling is clicked in a loop](#trigger-an-event-in-a-sibling-when-its-sibling-is-clicked-in-a-loop)
  - [Not create UI elements from Zero instead copy and peste and then modify](#not-create-ui-elements-from-zero-instead-copy-and-peste-and-then-modify)
    - [General](#general)
    - [choose tables even to show lists, cards, etc](#choose-tables-even-to-show-lists-cards-etc)
  - [Understand well the Injection system](#understand-well-the-injection-system)
    - [Getting Injected Objects as undefined](#getting-injected-objects-as-undefined)
    - [Observables seems not to trigger](#observables-seems-not-to-trigger)

## Do not add http interceptors by @Injectable

**Context:** I had several interceptors with different tasks, to add the Jwt, show
the loading screen, and to mock the backend.
**Problem:** In my case the interceptor which I mocked the backed, it didn't trigger
the other interceptors; add-jwt nor show-load-screen.
**Cause** It seems that the http interceptors when are added by @Injectable,
they are unstable, sometimes works others not, and also the order of calling
is not predecible, so better add the interceptors as functions.
**Solution:** Add the interceptor as a function and using `provideHttpClient` in
the main module.

For example:

1, We declare our function

```ts
const umImpl = new MockUsersBackendImpl();

export function usersMockBackendInterceptor(req: HttpRequest<any>, next: HttpHandlerFn ): Observable<HttpEvent<unknown>> {
  return umImpl.intercept(req, req.body);
}
```

2, We add our function in our MainModule

```ts
providers: [
    ...
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([..., usersMockBackendInterceptor])
    )
    ...
]
```

## How to override style properties in angular material 18

First we need to identify the variable, then we need to identify in witch class
is created, and overwrite it.

Example:

```scss
// we see this in the devtools of the browser
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--mat-checkbox-label-text-color, var(--mat-app-on-surface));
}

// we click in the devtools over the variable and we are sended to the class where it was declared
.mat-accent.mat-mdc-checkbox {
  --mat-checkbox-label-text-color: #1a1b1f;
}

// So we need to declare in our global styles the following overwrite
.mat-accent.mat-mdc-checkbox {
  --mat-checkbox-label-text-color: red;
}
```

## Avoid complex binding between Reactive form and the Object

For example for files/images, an array of objects, the complexity go up quickly,
but if you separate this complex objects related to the main object, you can
modularize this complexity.
In my case I wanted to use binding functionality of angular reactive forms, and
<!-- users/internals/view/components/user-form/user-form.component.ts -->
at the end, to convert from the array of permissions of the form, to the array
of permissions of the users it end up being pretty complicated or the use
of pretty specific API of the framework.

## Log javascript File is tricky

I had a problem of thinking I was not getting the File, but resulted that the
browser console don't print the file, for example i had.

```js
console.log("newInfo", newInfo);
//and I got printed this
{ "name": "Fofo", ... "pictureFile": null }

// But when I did this
console.log("newInfo", newInfo);
console.log("file", newInfo.pictureFile?.name);
//I got this
{ "name": "Fofo", ... "pictureFile": null }
file:  small_black.png
```

So here I understood that it was problem of the logger of the browser, not that
the file wasn't there.

## Trigger an event in a sibling when its sibling is clicked in a loop

The trick is just creating an identifier of witch one it's going to be show, and
then make the comparison, as object or an id of the object.

```html
<div *ngFor="let user of users">
  <button (click)="showDetails(user)">Show</button>
  <app-details [user]="user" [show]="currentUserDetails === user"></app-details>
</div>
```

```ts
@Component({ selector: 'app-root' ... })
export class AppComponent {
  users = [ { id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }, { id: 3, name: 'User 3' } ];
  
  currentUserDetails: any = null;
  
  showDetails(user: any) {
    this.currentUserDetails = user;
  }

}

// ---------------
@Component({ selector: 'app-details' })
export class DetailsComponent {
  @Input() user: User | null = null;
  @Input() show: boolean = false;
}
```

## Not create UI elements from Zero instead copy and peste and then modify

### General

Don't re-invent the wheel

### choose tables even to show lists, cards, etc

UI libraries already have a lot of functions pre-builded, for example, http
requests, sorting, filtering, pagination, etc. and also (TODO: ge sure), I
think you can use tables that looks like lists.

<!--

----------------------------------------------------------------------------

----------------------------------------------------------------------------

----------------------------------------------------------------------------

-->

## Understand well the Injection system

I have had two common errors when I deal with Injected object, and both of them
is because we need to have present how the Injection Dependency of angular works,

### Getting Injected Objects as undefined

It seems that is similar to HttpClient, we need to avoid making them in the
constructor, and use it in the `onInit()` or `afterViewInit()` to be sure that
they are already available.

### Observables seems not to trigger

The most likely is that we injected differently, the dependencies from angular,
and the the dependencies we have don't want to depend on their implementation,
just in their interface, we need to do it differently.

Dependencies of Angular

```ts
class X { ...
  private _router = inject(Router);
}
```

Dependencies we we want to hide it's Implementation and just expose it's interface

```ts
class X { ...
  constructor(
    @Inject(commonsNames.IAuthService) private _authSrv: AuthService,
  ) { ... }
}
```
