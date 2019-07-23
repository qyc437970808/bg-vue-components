/**
 *Created by 夜雪暮歌 on 2018/7/6
 **/
import { isEmptyResult } from "bg-vue-components/lib/util";

export default {
  props: [
    'name',
    'value',
    'placeholder',
    'label',
    'translateKey',
    'attr',
    'rules',
  ],
  methods: {
    // TODO: 匹配不为假值（除了0）的第一个值
    noEmptyVar(...variables) {
      return Array.from(variables).filter(item => !isEmptyResult(item))[0]
    }
  }
}
