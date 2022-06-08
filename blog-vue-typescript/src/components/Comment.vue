<template>
  <el-dialog
    title="评论"
    width="50%"
    center
    v-model="state.dialogDodel"
    append-to-body
    show-close
    @close="cancel"
  >
        <div class="comment">
          <h2>发表评论</h2>
          <div style="font-size: 10px; font-color:#dadada;">
            <span>邮箱地址不会被公开。 必填项已用 * 标注</span>
          </div>
          <el-form v-model="state" status-icon>
            <el-form-item label="评论">
              <el-input v-model="state.content" type="textarea" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="名称">
                  <el-input v-model="state.from.username" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮件">
                  <el-input v-model="state.from.email" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
          <el-form-item>
            <el-button type="primary" @click="handleOk">Submit</el-button>
          </el-form-item>
          </el-form>
        </div>
  </el-dialog>
</template>

<script lang="ts">
import { ElMessage } from "element-plus/es";
import { defineComponent, reactive, watch } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";



export default defineComponent({
  name: "Comment",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    comment_id: {
      type: String,
      default: "",
    },
    article_id: {
      type: String,
      default: "",
    },
    to_user: {
      // type: any,
      default: {},
    },
  },
  emits: ["ok", "cancel"],
  setup(props, context) {
    const state = reactive({
      dialogDodel: props.visible,
      btnLoading: false,
      from:{
        "username": "",
        "email": "",
      },
      content: "",
      cacheTime: 0, // 缓存时间
      times: 0, // 留言次数
    });

    const cancel = (): boolean => {
      context.emit("cancel", false);
      return false;
    };

    const handleOk = async (): Promise<void> => {
       if (!props.article_id) {
        ElMessage({
          message: "该文章不存在！",
          type: "error",
        });
        return;
      }

      let now = new Date();
      let nowTime = now.getTime();
      if (nowTime - state.cacheTime < 4000) {
        ElMessage({
          message: "您评论太过频繁，1 分钟后再来留言吧！",
          type: "warning",
        });
        return;
      }

      if (!state.content) {
        ElMessage({
          message: "请输入内容!",
          type: "warning",
        });
        return;
      }

      if (!state.from.username) {
        ElMessage({
          message: "请输入昵称!",
          type: "warning",
        });
        return;
      }

      if(state.from.username.length > 10||state.from.username.length < 2){
        ElMessage({
          message: "昵称长度不符合要求! (2-10)",
          type: "warning",
        });
        return;
      }

      if (!state.from.email) {
        ElMessage({
          message: "请输入邮箱!",
          type: "warning",
        });
        return;
      }

      const validateEmail = (email: string): boolean => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };

      if (!validateEmail(state.from.email)) {
        ElMessage({
          message: "邮箱格式不正确!",
          type: "warning",
        });
        return;
      }
      state.btnLoading = true;
      await service.post(urls.addThirdComment, {
        article_id: props.article_id,
        from_user:JSON.stringify(state.from),
        comment_id: props.comment_id,
        to_user: JSON.stringify(props.to_user),
        content: state.content,
      });
      state.btnLoading = false;
      state.times++;

      state.cacheTime = nowTime;
      state.content = "";
      state.from.username = "";
      state.from.email = "";
      context.emit("ok", false);
      ElMessage({
        message: "操作成功",
        type: "success",
      });
    };

    watch(props, (val, oldVal) => {
      state.dialogDodel = val.visible;
    });

    return {
      state,
      cancel,
      handleOk,
    };
  },
});
</script>
<style lang="less">
.el-dialog {
  margin: -40% auto 50px;
}


.dialog-footer {
  text-align: right;
}
</style>
