import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 50px; text-align: center; background: #f0f0f0; min-height: 100vh;">
      <h1 style="color: green;">✅ Angular is Working!</h1>
      <p>If you see this, your Angular app is loading correctly.</p>
      <p>Check: <code>http://localhost:4200</code></p>
      <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 10px;">
        <h3>Next steps:</h3>
        <ol style="text-align: left; display: inline-block;">
          <li>Check browser console for errors (F12)</li>
          <li>Test your actual routes</li>
          <li>Check if modules are loading</li>
        </ol>
      </div>
    </div>
  `
})
export class TestComponent {}