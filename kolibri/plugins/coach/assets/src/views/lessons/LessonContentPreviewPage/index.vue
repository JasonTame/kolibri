<template>

  <MultiPaneLayout>
    <div
      slot="header"
      class="header"
    >
      <div>
        <KGrid>
          <KGridItem sizes="100, 50, 50" percentage>
            <h1>{{ content.title }}</h1>
          </KGridItem>
          <KGridItem sizes="100, 50, 50" percentage alignment="right">
            <SelectOptions
              class="select-options ib"
              :isSelected="isSelected"
              @addResource="$emit('addResource', content)"
              @removeResource="$emit('removeResource', content)"
            />
          </KGridItem>
        </KGrid>
        <CoachContentLabel :value="content.num_coach_contents" :isTopic="false" />
        <p v-if="completionRequirements">{{ completionRequirements }}</p>
        <p v-if="description" v-html="description" dir="auto"></p>
        <ul class="meta">
          <li v-if="content.author">
            {{ $tr('authorDataHeader') }}:
            {{ content.author }}
          </li>
          <li v-if="content.license_name">
            {{ $tr('licenseDataHeader') }}:
            {{ content.license_name }}
            <InfoIcon
              v-if="content.license_description"
              tooltipPosition="right middle"
              :tooltipText="content.license_description"
              :iconAriaLabel="content.license_description"
            />
          </li>
          <li v-if="content.license_owner">
            {{ $tr('copyrightHolderDataHeader') }}:
            {{ content.license_owner }}
          </li>
        </ul>
      </div>

    </div>

    <QuestionList
      slot="aside"
      v-if="isPerseusExercise"
      @select="selectedQuestionIndex = $event"
      :questions="questions"
      :questionLabel="questionLabel"
      :selectedIndex="selectedQuestionIndex"
    />

    <ContentArea
      slot="main"
      :header="questionLabel(selectedQuestionIndex)"
      :selectedQuestion="selectedQuestion"
      :content="content"
      :isPerseusExercise="isPerseusExercise"
    />
  </MultiPaneLayout>

</template>


<script>

  import KButton from 'kolibri.coreVue.components.KButton';
  import MultiPaneLayout from 'kolibri.coreVue.components.MultiPaneLayout';
  import CoachContentLabel from 'kolibri.coreVue.components.CoachContentLabel';
  import InfoIcon from 'kolibri.coreVue.components.CoreInfoIcon';
  import KGrid from 'kolibri.coreVue.components.KGrid';
  import KGridItem from 'kolibri.coreVue.components.KGridItem';
  import markdownIt from 'markdown-it';
  import QuestionList from './QuestionList';
  import ContentArea from './ContentArea';
  import SelectOptions from './SelectOptions';

  export default {
    name: 'LessonContentPreviewPage',
    metaInfo() {
      return {
        title: this.currentContentNode.title,
      };
    },
    components: {
      QuestionList,
      ContentArea,
      SelectOptions,
      KButton,
      CoachContentLabel,
      InfoIcon,
      KGrid,
      KGridItem,
      MultiPaneLayout,
    },
    $trs: {
      questionLabel: 'Question { questionNumber, number }',
      completionRequirements: 'Completion: {correct, number} out of {total, number} correct',
      descriptionDataHeader: 'Description',
      authorDataHeader: 'Author',
      licenseDataHeader: 'License',
      copyrightHolderDataHeader: 'Copyright holder',
    },
    props: {
      currentContentNode: {
        type: Object,
        required: true,
      },
      isSelected: {
        type: Boolean,
        required: true,
      },
      questions: {
        type: Array,
        required: false,
        default: () => [],
      },
      completionData: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    data() {
      return {
        selectedQuestionIndex: 0,
      };
    },
    computed: {
      isPerseusExercise() {
        return this.content.kind === 'exercise';
      },
      selectedQuestion() {
        if (this.isPerseusExercise) {
          return this.questions[this.selectedQuestionIndex];
        }
        return '';
      },
      completionRequirements() {
        if (this.completionData) {
          const { m: correct, n: total } = this.completionData;
          return this.$tr('completionRequirements', { correct, total });
        }
        return false;
      },
      description() {
        if (this.content) {
          const md = new markdownIt('zero', { breaks: true });
          return md.render(this.content.description);
        }
      },
      content() {
        return this.currentContentNode;
      },
    },
    methods: {
      questionLabel(questionIndex) {
        if (!this.isPerseusExercise) {
          return '';
        }
        const questionNumber = questionIndex + 1;
        return this.$tr('questionLabel', { questionNumber });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri.styles.definitions';

  .meta {
    margin-bottom: 16px;
    font-size: smaller;
  }

</style>
