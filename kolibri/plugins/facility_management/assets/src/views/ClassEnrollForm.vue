<template>

  <form @submit.prevent="$emit('submit', selectedUsers)">
    <div class="actions-header">
      <KFilterTextbox
        :placeholder="$tr('searchForUser')"
        v-model.trim="filterInput"
        @input="pageNum = 1"
      />
    </div>

    <h2>{{ $tr('userTableLabel') }}</h2>

    <UserTable
      v-model="selectedUsers"
      :users="visibleFilteredUsers"
      :selectable="true"
      :selectAllLabel="$tr('selectAllOnPage')"
      :userCheckboxLabel="$tr('selectUser')"
      :emptyMessage="emptyMessage"
    />

    <nav>
      <span>
        {{ $tr('pagination', { visibleStartRange, visibleEndRange, numFilteredUsers }) }}
      </span>
      <UiIconButton
        type="primary"
        :ariaLabel="$tr('previousResults')"
        :disabled="pageNum === 1"
        size="small"
        @click="goToPage(pageNum - 1)"
      >
        <mat-svg
          v-if="isRtl"
          name="chevron_right"
          category="navigation"
        />
        <mat-svg
          v-else
          name="chevron_left"
          category="navigation"
        />
      </UiIconButton>
      <UiIconButton
        type="primary"
        :ariaLabel="$tr('nextResults')"
        :disabled="pageNum === numPages"
        size="small"
        @click="goToPage(pageNum + 1)"
      >
        <mat-svg
          v-if="isRtl"
          name="chevron_left"
          category="navigation"
        />
        <mat-svg
          v-else
          name="chevron_right"
          category="navigation"
        />
      </UiIconButton>
    </nav>

    <div class="footer">
      <KButton
        :text="$tr('confirmSelectionButtonLabel')"
        :primary="true"
        type="submit"
        :disabled="selectedUsers.length === 0"
      />
    </div>

  </form>

</template>


<script>

  import differenceWith from 'lodash/differenceWith';
  import KGrid from 'kolibri.coreVue.components.KGrid';
  import KGridItem from 'kolibri.coreVue.components.KGridItem';
  import responsiveWindow from 'kolibri.coreVue.mixins.responsiveWindow';
  import KButton from 'kolibri.coreVue.components.KButton';
  import KCheckbox from 'kolibri.coreVue.components.KCheckbox';
  import UiIconButton from 'keen-ui/src/UiIconButton';
  import KFilterTextbox from 'kolibri.coreVue.components.KFilterTextbox';
  import { userMatchesFilter, filterAndSortUsers } from '../userSearchUtils';
  import UserTable from './UserTable';
  import { Modals } from './../constants';

  export default {
    name: 'ClassEnrollForm',
    components: {
      KButton,
      KCheckbox,
      UiIconButton,
      KFilterTextbox,
      KGrid,
      KGridItem,
      UserTable,
    },
    mixins: [responsiveWindow],
    $trs: {
      confirmSelectionButtonLabel: 'Confirm',
      searchForUser: 'Search for a user',
      userIconColumnHeader: 'User Icon',
      name: 'Full name',
      username: 'Username',
      userTableLabel: 'User List',
      role: 'Role',
      // TODO clarify empty state messages after string freeze
      noUsersExist: 'No users exist',
      noUsersSelected: 'No users are selected',
      noUsersMatch: 'No users match',
      previousResults: 'Previous results',
      nextResults: 'Next results',
      selectAllOnPage: 'Select all on page',
      allUsersAlready: 'All users are already enrolled in this class',
      search: 'Search',
      selectUser: 'Select user',
      pagination:
        '{ visibleStartRange, number } - { visibleEndRange, number } of { numFilteredUsers, number }',
    },
    props: {
      facilityUsers: {
        type: Array,
        required: true,
      },
      classUsers: {
        type: Array,
        required: true,
      },
    },
    data: () => ({
      filterInput: '',
      perPage: 10,
      pageNum: 1,
      selectedUsers: [],
    }),
    computed: {
      usersNotInClass() {
        return differenceWith(this.facilityUsers, this.classUsers, (a, b) => a.id === b.id);
      },
      filteredUsers() {
        return this.usersNotInClass.filter(user => userMatchesFilter(user, this.filterInput));
      },
      sortedFilteredUsers() {
        return filterAndSortUsers(this.usersNotInClass, user =>
          userMatchesFilter(user, this.filterInput)
        );
      },
      numFilteredUsers() {
        return this.sortedFilteredUsers.length;
      },
      numPages() {
        return Math.ceil(this.numFilteredUsers / this.perPage);
      },
      startRange() {
        return (this.pageNum - 1) * this.perPage;
      },
      visibleStartRange() {
        return Math.min(this.startRange + 1, this.numFilteredUsers);
      },
      endRange() {
        return this.pageNum * this.perPage;
      },
      visibleEndRange() {
        return Math.min(this.endRange, this.numFilteredUsers);
      },
      visibleFilteredUsers() {
        return this.sortedFilteredUsers.slice(this.startRange, this.endRange);
      },
      showConfirmEnrollmentModal() {
        return this.modalShown === Modals.CONFIRM_ENROLLMENT;
      },
      emptyMessage() {
        if (this.facilityUsers.length === 0) {
          return this.$tr('noUsersExist');
        }
        if (this.usersNotInClass.length === 0) {
          return this.$tr('allUsersAlready');
        }
        if (this.sortedFilteredUsers.length === 0 && this.filterInput !== '') {
          // TODO internationalize this
          return `${this.$tr('noUsersMatch')}: '${this.filterInput}'`;
        }

        return '';
      },
    },
    methods: {
      reducePageNum() {
        while (this.visibleFilteredUsers.length === 0 && this.pageNum > 1) {
          this.pageNum = this.pageNum - 1;
        }
      },
      goToPage(page) {
        this.pageNum = page;
      },
      pageWithinRange(page) {
        const maxOnEachSide = 1;
        if (this.pageNum === 1 || this.pageNum === this.numPages) {
          return Math.abs(this.pageNum - page) <= maxOnEachSide + 1;
        }
        return Math.abs(this.pageNum - page) <= maxOnEachSide;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri.styles.definitions';

  .actions-header,
  .footer,
  nav {
    text-align: right;
  }

</style>
