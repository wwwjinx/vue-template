<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DeptInfo, RoleInfo, UserInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { treeselectDept } from '@/api/system/dept'
import {
  addUser,
  changeUserStatus,
  delUser,
  getUser,
  listUser,
  optionUserRoles,
  resetUserPwd,
  updateUser,
} from '@/api/system/user'
import { hasPermission } from '@/utils/auth'

const { sys_normal_disable, sys_user_sex } = useDict('sys_normal_disable', 'sys_user_sex')

const loading = ref(false)
const total = ref(0)
const users = ref<UserInfo[]>([])
const deptTree = ref<DeptInfo[]>([])
const roles = ref<RoleInfo[]>([])
const selectedIds = ref<number[]>([])
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  phonenumber: '',
  status: '',
  deptId: undefined as number | undefined,
})

const dialog = reactive({
  visible: false,
  title: '',
  isEdit: false,
})
const formRef = ref<FormInstance>()
const form = reactive<Partial<UserInfo>>({
  userName: '',
  nickName: '',
  password: '',
  deptId: undefined,
  email: '',
  phonenumber: '',
  sex: '0',
  status: '0',
  remark: '',
  roleIds: [],
})
const rules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function loadDepts() {
  deptTree.value = (await treeselectDept()) ?? []
}

async function loadRoles() {
  const res = await optionUserRoles()
  roles.value = res?.roles ?? []
}

async function loadUsers() {
  loading.value = true
  try {
    const res = await listUser({ ...query })
    users.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

function onDeptClick(node: DeptInfo) {
  query.deptId = node.deptId
  query.pageNum = 1
  loadUsers()
}

function resetQuery() {
  query.userName = ''
  query.phonenumber = ''
  query.status = ''
  query.deptId = undefined
  query.pageNum = 1
  loadUsers()
}

function resetForm() {
  Object.assign(form, {
    userId: undefined,
    userName: '',
    nickName: '',
    password: '',
    deptId: undefined,
    email: '',
    phonenumber: '',
    sex: '0',
    status: '0',
    remark: '',
    roleIds: [],
  })
  formRef.value?.clearValidate()
}

async function openCreate() {
  resetForm()
  await loadRoles()
  dialog.title = '新增用户'
  dialog.isEdit = false
  dialog.visible = true
}

async function openEdit(row: UserInfo) {
  resetForm()
  await loadRoles()
  const detail = await getUser(row.userId)
  Object.assign(form, detail, { roleIds: detail.roleIds ?? [] })
  dialog.title = '修改用户'
  dialog.isEdit = true
  dialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  const payload = { ...form }
  if (dialog.isEdit) {
    delete payload.password
    await updateUser(payload)
    ElMessage.success('修改成功')
  }
  else {
    await addUser(payload)
    ElMessage.success('新增成功')
  }
  dialog.visible = false
  loadUsers()
}

async function onDelete(row?: UserInfo) {
  const ids = row ? String(row.userId) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的用户吗？', '提示', { type: 'warning' })
  await delUser(ids)
  ElMessage.success('删除成功')
  loadUsers()
}

async function onStatusChange(row: UserInfo) {
  const next = row.status
  try {
    await ElMessageBox.confirm(`确认将该用户设为${next === '0' ? '正常' : '停用'}吗？`, '提示')
    await changeUserStatus(row.userId, next || '0')
    ElMessage.success('修改成功')
  }
  catch {
    row.status = next === '0' ? '1' : '0'
  }
}

async function onResetPwd(row: UserInfo) {
  const { value } = await ElMessageBox.prompt(`请输入用户 ${row.userName} 的新密码`, '重置密码', {
    inputType: 'password',
    inputPattern: /\S+/,
    inputErrorMessage: '密码不能为空',
  })
  await resetUserPwd(row.userId, value)
  ElMessage.success('重置成功')
}

onMounted(async () => {
  await Promise.all([loadDepts(), loadUsers()])
})
</script>

<template>
  <div class="page">
    <ElCard class="dept-pane" shadow="never">
      <ElTree
        :data="deptTree"
        node-key="deptId"
        :props="{ label: 'deptName', children: 'children' }"
        highlight-current
        default-expand-all
        @node-click="onDeptClick"
      />
    </ElCard>
    <div class="main-pane">
      <ElForm :inline="true" :model="query" @submit.prevent="loadUsers">
        <ElFormItem label="用户名">
          <ElInput v-model="query.userName" clearable placeholder="用户名" />
        </ElFormItem>
        <ElFormItem label="手机号">
          <ElInput v-model="query.phonenumber" clearable placeholder="手机号" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="query.status" clearable placeholder="状态" style="width: 140px">
            <ElOption v-for="item in sys_normal_disable.list" :key="item.value" :label="item.label" :value="item.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="query.pageNum = 1; loadUsers()">
            搜索
          </ElButton>
          <ElButton @click="resetQuery">
            重置
          </ElButton>
          <ElButton v-hasPermi="'system:user:add'" type="primary" @click="openCreate">
            新增
          </ElButton>
          <ElButton v-hasPermi="'system:user:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
            删除
          </ElButton>
        </ElFormItem>
      </ElForm>

      <ElTable v-loading="loading" :data="users" @selection-change="(rows: UserInfo[]) => selectedIds = rows.map(r => r.userId)">
        <ElTableColumn type="selection" width="50" />
        <ElTableColumn prop="userId" label="编号" width="70" />
        <ElTableColumn prop="userName" label="用户名" />
        <ElTableColumn prop="nickName" label="昵称" />
        <ElTableColumn label="部门">
          <template #default="{ row }">
            {{ row.dept?.deptName || '-' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="phonenumber" label="手机号" />
        <ElTableColumn label="状态" width="90">
          <template #default="{ row }">
            <ElSwitch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              :disabled="!hasPermission('system:user:edit')"
              @change="onStatusChange(row)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createTime" label="创建时间" min-width="160" />
        <ElTableColumn label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <ElButton v-hasPermi="'system:user:edit'" link type="primary" @click="openEdit(row)">
              修改
            </ElButton>
            <ElButton v-hasPermi="'system:user:remove'" link type="danger" @click="onDelete(row)">
              删除
            </ElButton>
            <ElButton v-hasPermi="'system:user:resetPwd'" link type="primary" @click="onResetPwd(row)">
              重置密码
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="pager">
        <ElPagination
          v-model:current-page="query.pageNum"
          v-model:page-size="query.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @current-change="loadUsers" @size-change="loadUsers"
        />
      </div>
    </div>

    <ElDialog v-model="dialog.visible" :title="dialog.title" width="560px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="用户名" prop="userName">
          <ElInput v-model="form.userName" :disabled="dialog.isEdit" />
        </ElFormItem>
        <ElFormItem label="昵称" prop="nickName">
          <ElInput v-model="form.nickName" />
        </ElFormItem>
        <ElFormItem v-if="!dialog.isEdit" label="密码" prop="password">
          <ElInput v-model="form.password" type="password" show-password />
        </ElFormItem>
        <ElFormItem label="部门" prop="deptId">
          <ElTreeSelect
            v-model="form.deptId"
            :data="deptTree"
            node-key="deptId"
            :props="{ label: 'deptName', children: 'children' }"
            check-strictly
            clearable
            placeholder="选择部门"
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="手机号">
          <ElInput v-model="form.phonenumber" />
        </ElFormItem>
        <ElFormItem label="邮箱">
          <ElInput v-model="form.email" />
        </ElFormItem>
        <ElFormItem label="性别">
          <ElSelect v-model="form.sex" style="width: 100%">
            <ElOption v-for="item in sys_user_sex.list" :key="item.value" :label="item.label" :value="item.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio v-for="item in sys_normal_disable.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="角色">
          <ElSelect v-model="form.roleIds" multiple style="width: 100%">
            <ElOption v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.remark" type="textarea" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialog.visible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="submit">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.dept-pane {
  width: 240px;
  flex-shrink: 0;
}
.main-pane {
  flex: 1;
  min-width: 0;
}
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
