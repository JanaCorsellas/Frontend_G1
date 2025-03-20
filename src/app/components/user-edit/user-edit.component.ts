import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class UserEditComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userId: string;
  loading = false;
  submitted = false;
  error = '';
  @Output() userEdit = new EventEmitter<boolean>();

  private subscriptions: Subscription = new Subscription();
  dialogRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { 
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profilePicture: [''],
      level: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserData(): void {
    this.loading = true;
    const loadSubscription = this.userService.getUserById(Number(this.userId))
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.userForm.patchValue({
            username: user.username,
            email: user.email,
            bio: user.bio || '',
            profilePicture: user.profilePicture || '',
            level: user.level
          });
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al cargar datos del usuario';
          console.error('Error:', error);
        }
      });
    
    this.subscriptions.add(loadSubscription);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      return;
    }
    
    this.loading = true;
    const updateSubscription = this.userService.updateUser(Number(this.userId), this.userForm.value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/users']);
        },
        error: (error: any) => {
          this.loading = false;
          this.error = 'Error al actualizar usuario';
          console.error('Error:', error);
        }
      });
    
    this.subscriptions.add(updateSubscription);
  }

  onCancel() {
    this.userEdit.emit(false);
  }

  get f() { 
    return this.userForm.controls; 
  }
}