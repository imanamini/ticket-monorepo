import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { suggestedSearchesConst } from '../constants/stores.const';
import { Store } from '../models/store.type';
import { ItemOverview, ServiceBadge } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { BranchModel } from '../models/branch.model';

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  ttlForOptionalLocation = 60 * 60 * 1000 * 24 * 28;

  getSuggestedSearches(): Observable<Array<string>> {
    return of(suggestedSearchesConst).pipe(delay(200));
  }

  convertStoreToItemOverView(
    stores: Store[],
    distancePipe: DistancePipe,
    removeDuplicates = false,
    existingIds?: Set<string | undefined>,
    removeBadges = false,
  ): ItemOverview[] {
    const newStores: ItemOverview[] = [];
    stores.map((store, index) => {
      if (removeDuplicates && existingIds) {
        if (existingIds.has(store.trackingCode)) {
          return;
        }
      }
      const item: ItemOverview = {
        id: store.trackingCode,
        image: {
          type: ServiceImagesType.IMAGE_ID,
          name: store.logoImageId,
        },
        title: store.title,
        badge: removeBadges ? undefined : this.generateBadges(store, distancePipe, store.distance),
        auctionBadge: store.auction,
        subTitleNormal: store.subtitle,
        divider: index !== stores.length - 1,
      };
      if (!removeBadges && store.score) {
        item.score = {
          amount: store.score.score,
          count: store.score.count,
        };
      }
      newStores.push(item);
    });
    return newStores;
  }

  generateBadges(store: Store, distancePipe: DistancePipe, distance?: number): ServiceBadge | undefined {
    if (distance && distance < 2000000) {
      return {
        text: distancePipe.transform(distance) as string,
        status: 'info',
        mode: 'fill',
      };
    } else if (store.badges.length) {
      const badge = store.badges[0];
      return { text: badge.content, status: badge.status, mode: badge.mode };
    } else {
      return undefined;
    }
  }

  convertBranchToItemOverView(
    branches: BranchModel[],
    distancePipe: DistancePipe,
    removeDuplicates = false,
    existingIds?: Set<string | undefined>,
    removeBadges = false,
  ): { item: ItemOverview; branch: BranchModel }[] {
    const newBranches: { item: ItemOverview; branch: BranchModel }[] = [];
    branches.map((branch, index) => {
      if (removeDuplicates && existingIds) {
        if (existingIds.has(branch.branchId)) {
          return;
        }
      }
      const item: ItemOverview = {
        id: branch.branchId,
        image: {
          type: ServiceImagesType.IMAGE_ID,
          name: branch.store.logoImageId,
        },
        title: branch.title,
        badge: removeBadges ? undefined : this.generateBadges(branch.store, distancePipe, branch.distance),
        auctionBadge: branch.store.auction,
        subTitleNormal: branch.store.subtitle,
        divider: index !== branches.length - 1,
      };
      if (!removeBadges && branch.store.score) {
        item.score = {
          amount: branch.store.score.score,
          count: branch.store.score.count,
        };
      }
      newBranches.push({ item, branch });
    });
    return newBranches;
  }
}
