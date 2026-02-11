import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IWidgetComponent } from './widget.interface';

@Directive()
export abstract class BaseWidgetComponent<TConfig, TData = unknown>
  implements OnInit, OnDestroy, IWidgetComponent<TConfig, TData>
{
  @Input() config!: TConfig;
  @Input() data?: TData;
  @Output() readonly configChange = new EventEmitter<Partial<TConfig>>();

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroyWidget();
  }

  updateConfig(config: Partial<TConfig>): void {
    this.config = { ...this.config, ...config };
    this.configChange.emit(config);
  }

  refreshData(): void {
    this.onRefreshData();
  }

  protected onInit(): void {}
  protected onDestroyWidget(): void {}
  protected onRefreshData(): void {}
}
