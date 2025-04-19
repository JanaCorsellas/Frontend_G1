import { Component, EventEmitter, Output } from '@angular/core';
import { AchievementService } from '../../services/achievements/achievement.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-create',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './achievement-create.component.html',
  styleUrl: './achievement-create.component.css'
})
export class AchievementCreateComponent {
  achievementForm: FormGroup;
  users:any[] = [];
  loading=false;
  error='';

  @Output()achievementCreated=new EventEmitter<boolean>();

  constructor(
    private formBuilder:FormBuilder,
    private achievementService: AchievementService,
    private userService: UserService
  ){
    this.achievementForm=this.formBuilder.group({
      title:['',[Validators.required]],
      description:['',[Validators.required]],
      condition:['',[Validators.required]],
      icon:['',Validators.required],
      usersUnlocked:[[]],
    });
  }

  onSubmit():void{
    if(this.achievementForm.invalid){
      this.achievementForm.markAllAsTouched();
      return;
    }

    this.loading=true;
    this.error='';

    this.achievementService.createAchievement(this.achievementForm.value).subscribe({
      next:()=>{
        this.loading=false;
        this.achievementCreated.emit(true);
        this.resetForm();
      },
      error:(error)=>{
        this.loading=false;
        this.error=error.message || 'Error al crear l\'achievement. Torna-ho a intentar.';
        console.error('Error al crear l\'achievement:', error);
      }
    });
  }

  resetForm():void{
    this.achievementForm.reset({
      title:'',
      description:'',
      condition: '',
      icon:'',
      usersUnlocked:[]
    });
  }
  cancel():void{
    this.achievementCreated.emit(false);
  }

  hasError(controlName: string, errorType: string) {
    return this.achievementForm.get(controlName)?.hasError(errorType) && 
           (this.achievementForm.get(controlName)?.touched || this.achievementForm.get(controlName)?.dirty);
  }
}
