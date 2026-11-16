<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { MenuInfo, RoleInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { menuTreeselect } from '@/api/system/menu'
import {
  addRole,
  changeRoleStatus,
  delRole,
  getRole,
  listRole,
  roleMenuTreeselect,
  updateRole,
} from '@/api/system/role'
import { hasPermission } from '@/utils/auth'

const { sys_normal_disable } = useDict('sys_normal_disable')

const loading = ref(false)
const total = ref(0)
const rows = ref<RoleInfo[]>([])
const selectedIds = ref<number[]>([])
const menuTree = ref<MenuInfo[]>([])
const menuRef = ref()
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: '',
  roleKey: '',
  status: '',
})
const dialog = reactive({ visible: false, title: '', isEdit: false })
const formRef = ref<FormInstance>()
const form = reactive<Partial<RoleInfo> & { menuIds?: number[] }>({
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  remark: '',
  menuIds: [],
  menuCheckStrictly: 1,
})
const rules: FormRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
  roleSort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}

async function loadList() {
  loading.value = true
  try {
    const res = await listRole({ ...query })
    rows.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

function resetQuery() {
  query.roleName = ''
  query.roleKey = ''
  query.status = ''
  query.pageNum = 1
  loadList()
}

async function openCreate() {
  Object.assign(form, { roleId: undefined, roleName: '', roleKey: '', roleSort: 0, status: '0', remark: '', menuIds: [], menuCheckStrictly: 1 })
  menuTree.value = (await menuTreeselect()) ?? []
  dialog.title = '新增角色'
  dialog.isEdit = false
  dialog.visible = true
  nextTick(() => menuRef.value?.setCheckedKeys([]))
}

async function openEdit(row: RoleInfo) {
  const detail = await getRole(row.roleId)
  const tree = await roleMenuTreeselect(row.roleId)
  Object.assign(form, detail, { menuIds: tree.checkedKeys ?? detail.menuIds ?? [] })
  menuTree.value = tree.menus ?? []
  dialog.title = '修改角色'
  dialog.isEdit = true
  dialog.visible = true
  nextTick(() => menuRef.value?.setCheckedKeys(form.menuIds ?? []))
}

function collectedMenuIds(): number[] {
  const checked = (menuRef.value?.getCheckedKeys() ?? []) as number[]
  const half = (menuRef.value?.getHalfCheckedKeys() ?? []) as number[]
  return [...new Set([...checked, ...half])]
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  const payload = { ...form, menuIds: collectedMenuIds() }
  if (dialog.isEdit)
    await updateRole(payload)
  else
    await addRole(payload)
  ElMessage.success(dialog.isEdit ? '修改成功' : '新增成功')
  dialog.visible = false
  loadList()
}

async function onDelete(row?: RoleInfo) {
  const ids = row ? String(row.roleId) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的角色吗？', '提示', { type: 'warning' })
  await delRole(ids)
  ElMessage.success('删除成功')
  loadList()
}

async function onStatusChange(row: RoleInfo) {
  const next = row.status
  try {
    await ElMessageBox.confirm(`确认将该角色设为${next === '0' ? '正常' : '停用'}吗？`, '提示')
    await changeRoleStatus(row.roleId, next)
    ElMessage.success('修改成功')
  }
  catch {
    row.status = next === '0' ? '1' : '0'
  }
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query" @submit.prevent="loadList">
      <ElFormItem label="角色名称">
        <ElInput v-model="query.roleName" clearable />
      </ElFormItem>
      <ElFormItem label="权限字符">
        <ElInput v-model="query.roleKey" clearable />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_normal_disable.list" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="query.pageNum = 1; loadList()">
          搜索
        </ElButton>
        <ElButton @click="resetQuery">
          重置
        </ElButton>
        <ElButton v-hasPermi="'system:role:add'" type="primary" @click="openCreate">
          新增
        </ElButton>
        <ElButton v-hasPermi="'system:role:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
          删除
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="rows" @selection-change="(list: RoleInfo[]) => selectedIds = list.map(i => i.roleId)">
      <ElTableColumn type="selection" width="50" />
      <ElTableColumn prop="roleId" label="编号" width="70" />
      <ElTableColumn prop="roleName" label="角色名称" />
      <ElTableColumn prop="roleKey" label="权限字符" />
      <ElTableColumn prop="roleSort" label="排序" width="80" />
      <ElTableColumn label="状态" width="90">
        <template #default="{ row }">
          <ElSwitch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            :disabled="!hasPermission('system:role:edit')"
            @change="onStatusChange(row)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="createTime" label="创建时间" min-width="160" />
      <ElTableColumn label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'system:role:edit'" link type="primary" @click="openEdit(row)">
            修改
          </ElButton>
          <ElButton v-hasPermi="'system:role:remove'" link type="danger" @click="onDelete(row)">
            删除
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
        @current-change="loadList" @size-change="loadList"
      />
    </div>

    <ElDialog v-model="dialog.visible" :title="dialog.title" width="560px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
        <ElFormItem label="角色名称" prop="roleName">
          <ElInput v-model="form.roleName" />
        </ElFormItem>
        <ElFormItem label="权限字符" prop="roleKey">
          <ElInput v-model="form.roleKey" />
        </ElFormItem>
        <ElFormItem label="角色排序" prop="roleSort">
          <ElInputNumber v-model="form.roleSort" :min="0" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio v-for="item in sys_normal_disable.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="菜单权限">
          <ElTree
            ref="menuRef"
            :data="menuTree"
            node-key="menuId"
            show-checkbox
            default-expand-all
            :check-strictly="form.menuCheckStrictly === 1"
            :props="{ label: 'menuName', children: 'children' }"
          />
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
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
