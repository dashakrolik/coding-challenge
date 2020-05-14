import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { Square } from './square';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId: number;
  interval;
  squares: Square[] = [];
  private x = 0;
  private y = 0;
  private z = 30;
  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.play();
    this.ctx.fillStyle = 'red';
  }

  tick = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares.forEach((square: Square) => {
      square.moveRight();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play = () => {
    const square = new Square(this.ctx);
    this.squares = this.squares.concat(square);
    
    this.squares.forEach(() => {
      this.ctx.fillStyle = 'blue';
      this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
      
    });
    
  }

  moveRight = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.x++;
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
  }


  ngOnDestroy() {
    // clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
}


