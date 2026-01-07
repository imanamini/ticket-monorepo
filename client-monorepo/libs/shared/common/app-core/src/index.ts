// Export environment service for simple static access
export * from './lib/data-access/services/environment.service';

export * from './lib/components/navigation/navigation.component';
export * from './lib/components/feedback-sheet/feedback-sheet.component';
export * from './lib/data-access/models/navigation-item.interface';
export * from './lib/data-access/models/open-feedback.interface';
export * from './lib/data-access/services/custom-error-handler.service';
export * from './lib/data-access/services/custom-preloading-strategy.service';
export * from './lib/data-access/services/service-worker-handler.service';
export * from './lib/features/layouts/with-navigation/with-navigation.component';
export * from './lib/features/layouts/no-navigation/no-navigation.component';
export * from './lib/features/layouts/main/main.module';
export * from './lib/features/layouts/main/main.component';
export { default as checkRedirectGuard } from './lib/utils/check-redirect.guard';
export * from './lib/utils/initializer';
export * from './lib/data-access/consts/app-config.const';
export * from './lib/components/main/app.component';

export * from './lib/components/campaign/campaign.component';
export * from './lib/data-access/services/eruda.service';
