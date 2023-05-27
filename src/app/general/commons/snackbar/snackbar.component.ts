import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarOptions } from '../classes/Dialog';


@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements AfterViewInit {

  interval: any;
  duration = 0;
  rootId = `snackbar_root_${new Date().getTime()}`;
  progresId = `snackbar_progress_${new Date().getTime()}`;

  constructor(
    private snackbarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarOptions,
  ) {
    this.data = this.setDefaultOptions(data);
    this.duration = this.data.duration;
  }

  setDefaultOptions(options: SnackBarOptions) {
    const defaultOptions: SnackBarOptions = {
      duration: 3000,
      showCloseButton: true
    };
    return { ...defaultOptions, ...options };
  }

  ngAfterViewInit() {
    this.createInterval();

    const root = document.getElementById(this.rootId);

    root?.addEventListener('mouseover', () => {
      clearInterval(this.interval);
    });

    root?.addEventListener('mouseout', () => {
      this.createInterval();
    });
  }

  createInterval() {
    const step = 15;
    const progress = document.getElementById(this.progresId);

    if (!progress) return;

    progress.addEventListener('mouseover', (event) => event.preventDefault());
    progress.addEventListener('mouseout', (event) => event.preventDefault());

    this.interval = setInterval(() => {
      window.requestAnimationFrame(() => {
        this.duration -= step;
        if (this.duration <= 0) {
          this.close();
          clearInterval(this.interval);
          return;
        }
        progress.style.width = (this.duration / this.data.duration * 100) + '%';
        progress.style.transitionDuration = step + 'ms';
      });
    }, step);
  }

  close() {
    this.snackbarRef.dismiss()
  }
}
